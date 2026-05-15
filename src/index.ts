import "dotenv/config";
import express, { type Request, type Response, type NextFunction } from "express";
import { Pool, type PoolClient } from "pg";
import { z } from "zod";

const port = parseInt(process.env.PORT || "10000", 10);
const databaseUrl = process.env.DATABASE_URL;
const serviceApiKey = process.env.SERVICE_API_KEY;
const defaultTopK = Math.max(1, Math.min(50, parseInt(process.env.DEFAULT_TOP_K || "20", 10)));
const maxTopK = Math.max(defaultTopK, Math.min(100, parseInt(process.env.MAX_TOP_K || "50", 10)));
const defaultMinScore = Math.max(0, Math.min(1, Number(process.env.DEFAULT_MIN_SCORE || "0.2")));

if (!databaseUrl) throw new Error("DATABASE_URL is required");
if (!serviceApiKey) throw new Error("SERVICE_API_KEY is required");

// --- Date Helpers ---
const parseIsraeliDate = (str: string): string | null => {
  const match = str.match(/(\d{1,2})[.\/](\d{1,2})[.\/](\d{2,4})/);
  if (!match) return null;
  let [_, d, m, y] = match;
  if (y.length === 2) y = "20" + y;
  const date = new Date(`${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`);
  if (isNaN(date.getTime())) return null;
  return date.toISOString().split("T")[0];
};

const extractEarliestDate = (text: string): string | null => {
  const dates: string[] = [];
  const regex = /(\d{1,2})[.\/](\d{1,2})[.\/](\d{2,4})/g;
  let m;
  while ((m = regex.exec(text)) !== null) {
    const d = parseIsraeliDate(m[0]);
    if (d) dates.push(d);
  }
  if (dates.length === 0) return null;
  return dates.sort()[0];
};

const isScheduleQuestion = (q: string) => {
  const s = (q || "").toLowerCase();
  return [
    "שיעור הבא", "השיעור הבא", "שיעור הקרוב", "השיעור הקרוב",
    "מפגש הבא", "מפגש הקרוב", "מה השיעור", "לוז", "לו\"ז", "לו״ז",
    "לוח זמנים", "השיעורים הבאים", "המפגשים הבאים"
  ].some(k => s.includes(k));
};

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false },
  max: 10,
});

const app = express();
app.use(express.json({ limit: "6mb" }));

app.use((req, res, next) => {
  const started = Date.now();
  console.log(`[REQ] ${req.method} ${req.path}`);
  res.on("finish", () => {
    const ms = Date.now() - started;
    console.log(`[REQ_DONE] ${req.path} status=${res.statusCode} ${ms}ms`);
  });
  next();
});

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const header = req.header("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice("Bearer ".length).trim() : "";
  if (!token || token !== serviceApiKey) {
    return res.status(401).json({ error: "unauthorized" });
  }
  next();
};

const querySchema = z.object({
  query: z.string().min(1),
  top_k: z.number().int().min(1).max(100).optional(),
  min_score: z.number().min(0).max(1).optional(),
  query_embedding: z.array(z.number()).length(1536).optional(),
  user_id: z.string().nullable().optional(),
  allowed_document_ids: z.array(z.string()).nullable().optional(),
});

const ingestSchema = z.object({
  document: z.object({
    id: z.string().min(1),
    file_name: z.string().nullable().optional(),
    category: z.string().nullable().optional(),
    is_enabled: z.boolean().optional(),
  }),
  chunks: z.array(z.object({
    id: z.string().min(1),
    document_id: z.string().min(1),
    chunk_index: z.number().int().min(0),
    content: z.string().min(1),
    embedding: z.array(z.number()).length(1536).optional(),
    metadata: z.record(z.any()).optional(),
  })).min(1),
});

const deleteSchema = z.object({
  document_id: z.string().min(1),
});

const toPgVectorLiteral = (embedding: number[]): string => `[${embedding.join(",")}]`;

app.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true, service: "lony-gbrain-service" });
  } catch (e) {
    console.error("[HEALTH] db_error", e instanceof Error ? e.message : e);
    res.status(500).json({ ok: false, error: e instanceof Error ? e.message : "db_error" });
  }
});

app.post("/query", authMiddleware, async (req, res) => {
  const parsed = querySchema.safeParse(req.body);
  if (!parsed.success) {
    console.error("[QUERY] validation_error", parsed.error.flatten());
    return res.status(400).json({ error: "invalid_payload", details: parsed.error.flatten() });
  }

  const { query, query_embedding, top_k, min_score, allowed_document_ids, user_id } = parsed.data;
  const topK = Math.max(1, Math.min(maxTopK, top_k ?? defaultTopK));
  const minScore = Math.max(0, Math.min(1, min_score ?? defaultMinScore));
  const lexicalLimit = Math.max(30, Math.min(120, topK * 8));
  const semanticLimit = Math.max(60, Math.min(220, topK * 16));
  const started = Date.now();

  if (!query) return res.status(400).json({ error: "query_required" });

  let client: PoolClient | undefined;
  console.log(`[QUERY] start topK=${topK} minScore=${minScore} user=${user_id ? "yes" : "no"} allowList=${allowed_document_ids?.length || 0}`);

  try {
    client = await pool.connect();

    const buildFilter = (firstParamIndex: number) => {
      const clauses = ["d.is_enabled = true"];
      const params: unknown[] = [];
      if (allowed_document_ids && allowed_document_ids.length > 0) {
        params.push(allowed_document_ids);
        clauses.push(`c.document_id = ANY($${firstParamIndex + params.length - 1}::text[])`);
      }
      if (user_id) {
        params.push(user_id);
        clauses.push(`NOT EXISTS (
          SELECT 1 FROM public.knowledge_document_access b
          WHERE b.user_id = $${firstParamIndex + params.length - 1}::uuid
            AND b.document_id::text = c.document_id
        )`);
      }
      return { clauses, params };
    };

    const lexicalFilter = buildFilter(2);
    const lexicalSql = `
      SELECT
        c.id, c.document_id, c.chunk_index, c.content, c.metadata, d.file_name,
        ts_rank_cd(to_tsvector('simple', c.content), websearch_to_tsquery('simple', $1::text))::float8 AS lex_score
      FROM public.gbrain_chunks c
      JOIN public.gbrain_documents d ON d.id = c.document_id
      WHERE ${lexicalFilter.clauses.join(" AND ")}
      ORDER BY ts_rank_cd(to_tsvector('simple', c.content), websearch_to_tsquery('simple', $1::text)) DESC
      LIMIT ${lexicalLimit}
    `;
    const lexicalPromise = client.query(lexicalSql, [query, ...lexicalFilter.params]);

    let embedding = query_embedding;
    if (!embedding) {
      const aiRes = await fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: { "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: "text-embedding-3-small", input: query }),
      });
      const aiData = await aiRes.json();
      embedding = aiData.data?.[0]?.embedding;
    }

    if (!embedding) throw new Error("embedding_failed");
    const vectorLiteral = toPgVectorLiteral(embedding);

    const semanticFilter = buildFilter(3);
    const semanticSql = `
      SELECT
        c.id, c.document_id, c.chunk_index, c.content, c.metadata, d.file_name,
        (1 - (c.embedding <=> $1::vector))::float8 AS score
      FROM public.gbrain_chunks c
      JOIN public.gbrain_documents d ON d.id = c.document_id
      WHERE (1 - (c.embedding <=> $1::vector)) >= $2
        AND ${semanticFilter.clauses.join(" AND ")}
      ORDER BY c.embedding <=> $1::vector ASC
      LIMIT ${semanticLimit}
    `;

    const [semanticResult, lexicalResult] = await Promise.all([
      client.query(semanticSql, [vectorLiteral, minScore, ...semanticFilter.params]),
      lexicalPromise,
    ]);

    const keyOf = (row: any) => `${row.id}`;
    const semanticRank = new Map<string, number>();
    const lexicalRank = new Map<string, number>();
    semanticResult.rows.forEach((r: any, i: number) => semanticRank.set(keyOf(r), i + 1));
    lexicalResult.rows.forEach((r: any, i: number) => lexicalRank.set(keyOf(r), i + 1));

    const byId = new Map<string, any>();
    for (const row of semanticResult.rows) byId.set(keyOf(row), row);
    for (const row of lexicalResult.rows) {
      if (!byId.has(keyOf(row))) byId.set(keyOf(row), row);
    }

    let candidates = Array.from(byId.values()).map((row) => {
      const id = keyOf(row);
      const sRank = semanticRank.get(id);
      const lRank = lexicalRank.get(id);
      const semanticScore = Number(row.score ?? 0);
      const fusedScore = (sRank ? 1 / (60 + sRank) : 0) + (lRank ? 1 / (60 + lRank) : 0);
      return { ...row, score: semanticScore, fused_score: fusedScore };
    }).sort((a, b) => b.fused_score - a.fused_score);

    // --- Date-Aware Sorting ---
    if (isScheduleQuestion(query)) {
      const todayIso = new Date().toISOString().split("T")[0];
      candidates = candidates.sort((a, b) => {
        const aDate = extractEarliestDate(a.content);
        const bDate = extractEarliestDate(b.content);
        
        if (aDate && bDate) {
          const aFuture = aDate >= todayIso ? 0 : 1;
          const bFuture = bDate >= todayIso ? 0 : 1;
          if (aFuture !== bFuture) return aFuture - bFuture;
          const aDiff = Math.abs(new Date(aDate).getTime() - new Date(todayIso).getTime());
          const bDiff = Math.abs(new Date(bDate).getTime() - new Date(todayIso).getTime());
          return aDiff - bDiff;
        }
        if (aDate) return -1;
        if (bDate) return 1;
        return 0;
      });
    }

    const fused = candidates.slice(0, topK);

    const out = {
      chunks: fused.map((r) => ({
        id: r.id,
        document_id: r.document_id,
        chunk_index: r.chunk_index,
        content: r.content,
        metadata: r.metadata || {},
        file_name: r.file_name,
        score: Number(r.score ?? 0),
        fused_score: Number(r.fused_score ?? 0),
      })),
    };
    console.log(`[QUERY] success chunks=${out.chunks.length} semantic=${semanticResult.rows.length} lexical=${lexicalResult.rows.length} total_ms=${Date.now() - started}`);
    res.json(out);
  } catch (e) {
    console.error("[QUERY] error", e instanceof Error ? e.message : e);
    res.status(500).json({ error: e instanceof Error ? e.message : "query_failed" });
  } finally {
    // Ensure pooled connection is always returned on both success and failure paths.
    if (typeof client !== "undefined") client.release();
  }
});

app.post("/ingest", authMiddleware, async (req, res) => {
  const parsed = ingestSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_payload", details: parsed.error.flatten() });

  const { document, chunks } = parsed.data;
  const client = await pool.connect();
  const started = Date.now();
  console.log(`[INGEST] start doc=${document.id} chunks=${chunks.length}`);
  try {
    await client.query("BEGIN");
    await client.query(
      `
      INSERT INTO public.gbrain_documents (id, file_name, category, is_enabled, metadata, updated_at)
      VALUES ($1, $2, $3, $4, '{}'::jsonb, now())
      ON CONFLICT (id) DO UPDATE
      SET file_name = EXCLUDED.file_name,
          category = EXCLUDED.category,
          is_enabled = EXCLUDED.is_enabled,
          updated_at = now()
      `,
      [document.id, document.file_name ?? null, document.category ?? null, document.is_enabled ?? true],
    );

    await client.query("DELETE FROM public.gbrain_chunks WHERE document_id = $1", [document.id]);
    for (const chunk of chunks) {
      await client.query(
        `
        INSERT INTO public.gbrain_chunks
          (id, document_id, chunk_index, content, embedding, metadata, updated_at)
        VALUES
          ($1, $2, $3, $4, $5::vector, $6::jsonb, now())
        ON CONFLICT (id) DO UPDATE
        SET document_id = EXCLUDED.document_id,
            chunk_index = EXCLUDED.chunk_index,
            content = EXCLUDED.content,
            embedding = EXCLUDED.embedding,
            metadata = EXCLUDED.metadata,
            updated_at = now()
        `,
        [
          chunk.id,
          chunk.document_id,
          chunk.chunk_index,
          chunk.content,
          chunk.embedding ? toPgVectorLiteral(chunk.embedding) : null,
          JSON.stringify(chunk.metadata || {}),
        ],
      );
    }
    await client.query("COMMIT");
    console.log(`[INGEST] success doc=${document.id} chunks=${chunks.length} total_ms=${Date.now() - started}`);
    res.json({ ok: true, document_id: document.id, chunks: chunks.length });
  } catch (e) {
    await client.query("ROLLBACK");
    console.error("[INGEST] error", e instanceof Error ? e.message : e);
    res.status(500).json({ error: e instanceof Error ? e.message : "ingest_failed" });
  } finally {
    client.release();
  }
});

app.post("/delete", authMiddleware, async (req, res) => {
  const parsed = deleteSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_payload", details: parsed.error.flatten() });
  try {
    await pool.query("DELETE FROM public.gbrain_documents WHERE id = $1", [parsed.data.document_id]);
    console.log(`[DELETE] success doc=${parsed.data.document_id}`);
    res.json({ ok: true, document_id: parsed.data.document_id });
  } catch (e) {
    console.error("[DELETE] error", e instanceof Error ? e.message : e);
    res.status(500).json({ error: e instanceof Error ? e.message : "delete_failed" });
  }
});

app.listen(port, () => {
  console.log(`lony-gbrain-service listening on :${port}`);
});
