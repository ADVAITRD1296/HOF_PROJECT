-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- Create the legal_documents table to store our chunks and embeddings
create table if not exists legal_documents (
  id bigserial primary key,
  act_name text,
  section text,
  title text,
  chunk_text text,
  doc_type text default 'statute', -- 'statute' or 'case'
  embedding vector(384) -- 384 dimensions for all-MiniLM-L6-v2
);

-- Turn on Row Level Security (RLS) but allow service_role to bypass it
alter table legal_documents enable row level security;

-- Create a function to similarity search for documents with type filtering
create or replace function match_legal_documents (
  query_embedding vector(384),
  match_threshold float,
  match_count int,
  p_doc_type text default null -- Optional filter for 'statute' or 'case'
)
returns table (
  id bigint,
  act_name text,
  section text,
  title text,
  chunk_text text,
  doc_type text,
  similarity float
)
language sql stable
as $$
  select
    id,
    act_name,
    section,
    title,
    chunk_text,
    doc_type,
    1 - (embedding <=> query_embedding) as similarity
  from legal_documents
  where (1 - (embedding <=> query_embedding) > match_threshold)
    and (p_doc_type is null or doc_type = p_doc_type)
  order by embedding <=> query_embedding
  limit match_count;
$$;
