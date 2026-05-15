# Lony GBrain Service (Render-ready)

שירות עצמאי ל־GBrain עבור Lony, עם 3 endpoints:
- `POST /query` — retrieval היברידי (semantic + lexical + fusion)
- `POST /ingest` — upsert מסמך + צ’אנקים
- `POST /delete` — מחיקת מסמך מהאינדקס

השירות מוגן עם `Authorization: Bearer <SERVICE_API_KEY>`.

---

## 1) מה צריך לפני

- פרויקט Render
- מסד PostgreSQL נגיש (אפשר Supabase Postgres)
- `OPENAI_API_KEY`
- סוד פנימי `SERVICE_API_KEY` (מומלץ מחרוזת אקראית ארוכה)

---

## 2) פריסה ל-Render

אפשרות A (מומלץ): דרך `render.yaml`
1. Push של הריפו ל-GitHub.
2. ב-Render: New + Blueprint.
3. לבחור את הריפו.  
4. Render יזהה `gbrain-render-service/render.yaml`.
5. למלא env vars החסרים:
   - `DATABASE_URL`
   - `SERVICE_API_KEY`
   - `OPENAI_API_KEY`

אפשרות B: Web Service רגיל
- Root Directory: `gbrain-render-service`
- Build command: `npm ci && npm run build`
- Start command: `npm run start`

---

## 3) הכנת DB (חד-פעמי)

להריץ את הסקריפט:
- `gbrain-render-service/sql/001_init.sql`

על אותו DB שהשירות משתמש בו (`DATABASE_URL`).

---

## 4) חיבור ל-Supabase Functions של Lony

להגדיר ב-Supabase secrets:

- `GBRAIN_ENDPOINT=https://<render-domain>/query`
- `GBRAIN_INGEST_ENDPOINT=https://<render-domain>/ingest`
- `GBRAIN_DELETE_ENDPOINT=https://<render-domain>/delete`
- `GBRAIN_API_KEY=<SERVICE_API_KEY>`

ואז deploy לפונקציות:
- `knowledge-chat`
- `process-document`

---

## 5) בדיקות מהירות

Health:
```bash
curl https://<render-domain>/health
```

Ingest:
```bash
curl -X POST https://<render-domain>/ingest \
  -H "Authorization: Bearer <SERVICE_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
    "document":{"id":"doc_1","file_name":"demo.pdf","category":"course","is_enabled":true},
    "chunks":[{"id":"doc_1:0","document_id":"doc_1","chunk_index":0,"content":"טקסט לדוגמה","embedding":[0,0,0]}]
  }'
```

> הערה: `embedding` חייב להיות 1536 ערכים. בדוגמה למעלה זה רק מבנה payload.

Query:
```bash
curl -X POST https://<render-domain>/query \
  -H "Authorization: Bearer <SERVICE_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{"query":"מה השיעור הבא?","top_k":10,"min_score":0.2}'
```

Delete:
```bash
curl -X POST https://<render-domain>/delete \
  -H "Authorization: Bearer <SERVICE_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{"document_id":"doc_1"}'
```

---

## 6) מבנה payloads

### POST /query
```json
{
  "query": "string",
  "top_k": 20,
  "min_score": 0.2,
  "user_id": "uuid|null",
  "allowed_document_ids": ["doc1","doc2"] 
}
```

### POST /ingest
```json
{
  "document": {
    "id": "doc_id",
    "file_name": "name.pdf",
    "category": "category",
    "is_enabled": true
  },
  "chunks": [
    {
      "id": "doc_id:0",
      "document_id": "doc_id",
      "chunk_index": 0,
      "content": "chunk content",
      "embedding": [/* 1536 floats */],
      "metadata": {}
    }
  ]
}
```

### POST /delete
```json
{
  "document_id": "doc_id"
}
```
