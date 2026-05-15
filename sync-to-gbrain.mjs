#!/usr/bin/env node
/**
 * Sync all knowledge_documents + knowledge_chunks (with embeddings)
 * from Supabase → GBrain Render service via /ingest endpoint.
 *
 * Usage: node sync-to-gbrain.mjs
 */

const SUPABASE_URL = "https://ewpeetbfvonydtqqccjw.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3cGVldGJmdm9ueWR0cXFjY2p3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzk2Nzg3MSwiZXhwIjoyMDczNTQzODcxfQ.xpqc6wyFG2O6HWBmZ23FfWdVrA6UmUv8vS0Zx5q_x9E";

const GBRAIN_URL = "https://lony-gbrain-service-v6.onrender.com";
const GBRAIN_API_KEY =
  "3f9d8e4f2e7fdab63573ebd827d7f69eee5913f190f740765306f7022b035c28";

async function supabaseQuery(table, params = "") {
  const url = `${SUPABASE_URL}/rest/v1/${table}?${params}`;
  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase ${table} ${res.status}: ${text}`);
  }
  return res.json();
}

async function ingestToGbrain(document, chunks) {
  const res = await fetch(`${GBRAIN_URL}/ingest`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GBRAIN_API_KEY}`,
    },
    body: JSON.stringify({ document, chunks }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GBrain ingest ${res.status}: ${text}`);
  }
  return res.json();
}

async function main() {
  console.log("=== Syncing Supabase → GBrain ===\n");

  // 1. Fetch all enabled, completed documents
  const docs = await supabaseQuery(
    "knowledge_documents",
    "status=eq.completed&is_enabled=eq.true&select=id,file_name,category,is_enabled&order=created_at"
  );
  console.log(`Found ${docs.length} documents to sync.\n`);

  let successCount = 0;
  let failCount = 0;

  for (const doc of docs) {
    const shortName =
      (doc.file_name || "unknown").slice(0, 50) +
      (doc.file_name?.length > 50 ? "…" : "");
    process.stdout.write(`[${successCount + failCount + 1}/${docs.length}] ${shortName} ... `);

    try {
      // 2. Fetch chunks for this document, including embedding
      const chunks = await supabaseQuery(
        "knowledge_chunks",
        `document_id=eq.${doc.id}&select=id,document_id,chunk_index,content,metadata,embedding&order=chunk_index`
      );

      if (chunks.length === 0) {
        console.log(`SKIP (0 chunks)`);
        continue;
      }

      // 3. Transform chunks for GBrain format
      // Supabase REST API returns pgvector embeddings as strings "[0.1,0.2,...]"
      const parseEmbedding = (raw) => {
        if (!raw) return undefined;
        if (Array.isArray(raw)) return raw;
        if (typeof raw === "string") {
          try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) return parsed;
          } catch {}
          // pgvector format: [0.1,0.2,...] 
          const cleaned = raw.replace(/^\[|\]$/g, "");
          if (cleaned) return cleaned.split(",").map(Number);
        }
        return undefined;
      };

      const gbrainChunks = chunks.map((c) => ({
        id: c.id,
        document_id: c.document_id,
        chunk_index: c.chunk_index ?? 0,
        content: c.content || "",
        embedding: parseEmbedding(c.embedding),
        metadata: c.metadata || {},
      }));

      // 4. Ingest to GBrain
      const result = await ingestToGbrain(
        {
          id: doc.id,
          file_name: doc.file_name,
          category: doc.category,
          is_enabled: doc.is_enabled,
        },
        gbrainChunks
      );

      console.log(`OK (${result.chunks} chunks)`);
      successCount++;
    } catch (err) {
      console.log(`FAIL: ${err.message}`);
      failCount++;
    }
  }

  console.log(`\n=== Done: ${successCount} succeeded, ${failCount} failed ===`);

  // 5. Verify with a quick health check
  try {
    const healthRes = await fetch(`${GBRAIN_URL}/health`);
    const health = await healthRes.json();
    console.log(`GBrain health: ${JSON.stringify(health)}`);
  } catch (e) {
    console.log(`Health check failed: ${e.message}`);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
