CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE IF NOT EXISTS public.gbrain_documents (
  id text PRIMARY KEY,
  file_name text,
  category text,
  is_enabled boolean NOT NULL DEFAULT true,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.gbrain_chunks (
  id text PRIMARY KEY,
  document_id text NOT NULL REFERENCES public.gbrain_documents(id) ON DELETE CASCADE,
  chunk_index integer NOT NULL,
  content text NOT NULL,
  embedding vector(1536),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gbrain_chunks_document_id ON public.gbrain_chunks(document_id);
CREATE INDEX IF NOT EXISTS idx_gbrain_chunks_chunk_index ON public.gbrain_chunks(document_id, chunk_index);
CREATE INDEX IF NOT EXISTS idx_gbrain_chunks_content_tsv ON public.gbrain_chunks USING GIN (to_tsvector('simple', content));
CREATE INDEX IF NOT EXISTS idx_gbrain_chunks_embedding_hnsw ON public.gbrain_chunks USING hnsw (embedding vector_cosine_ops);

