-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- Create the legal_documents table to store our chunks and embeddings
create table if not exists legal_documents (
  id bigserial primary key,
  act_name text,
  section text,
  title text,
  chunk_text text,
  embedding vector(384) -- 384 dimensions for all-MiniLM-L6-v2
);

-- Turn on Row Level Security (RLS) but allow service_role to bypass it
alter table legal_documents enable row level security;

-- Create a function to similarity search for documents
create or replace function match_legal_documents (
  query_embedding vector(384),
  match_threshold float,
  match_count int
)
returns table (
  id bigint,
  act_name text,
  section text,
  title text,
  chunk_text text,
  similarity float
)
language sql stable
as $$
  select
    legal_documents.id,
    legal_documents.act_name,
    legal_documents.section,
    legal_documents.title,
    legal_documents.chunk_text,
    1 - (legal_documents.embedding <=> query_embedding) as similarity
  from legal_documents
  where 1 - (legal_documents.embedding <=> query_embedding) > match_threshold
  order by legal_documents.embedding <=> query_embedding
  limit match_count;
$$;
