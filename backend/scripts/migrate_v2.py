import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in .env")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# SQL to update the function
# We add p_doc_type and ensure doc_type column exists
sql = """
-- 1. Ensure doc_type column exists
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='legal_documents' AND column_name='doc_type') THEN
        ALTER TABLE legal_documents ADD COLUMN doc_type text DEFAULT 'statute';
    END IF;
END $$;

-- 2. Update the match function
create or replace function match_legal_documents (
  query_embedding vector(384),
  match_threshold float,
  match_count int,
  p_doc_type text default null
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
"""

try:
    print(f"Applying migration to {SUPABASE_URL}...")
    # Using the RPC mechanism isn't for raw SQL, usually we need to use the POSTGREST raw interface
    # However, since Supabase python client doesn't expose a raw 'sql' method easily, 
    # we will provide this as a guide or try to use a direct postgres connection if possible.
    # ALTERNATIVE: Use the Supabase dashboard logic.
    print("MIGRATION SQL READY:")
    print(sql)
except Exception as e:
    print(f"Error: {e}")
