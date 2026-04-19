"""
Legal Document Ingestion Pipeline
Loads PDFs/DOCX/TXT → chunks → embeds → stores in vector DB
Supports single-file Upsert to prevent duplicate embeddings.
"""

import os
import re
import argparse
from pathlib import Path
from loguru import logger
from typing import List, Optional

def chunk_text(text: str, chunk_size=1000, overlap=100) -> List[str]:
    """Splits text into chunks of ~1000 characters with 100 character overlap."""
    chunks = []
    start = 0
    text_len = len(text)

    if text_len <= chunk_size:
        return [text.strip()] if text.strip() else []

    while start < text_len:
        end = start + chunk_size
        
        if end < text_len:
            # Try to find the end of a sentence
            sentence_end = text.rfind('. ', start + chunk_size - 150, end)
            if sentence_end == -1:
                sentence_end = text.rfind('.\n', start + chunk_size - 150, end)
            
            if sentence_end != -1:
                end = sentence_end + 1
        
        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)
        
        start = end - overlap
        if start >= text_len or end >= text_len:
            break
            
    return chunks

def parse_sections(content: str) -> List[tuple]:
    """Splits content into sections. Returns list of (section_number, section_text)."""
    if "Section" in content:
        parts = re.split(r'^Section\s+', content, flags=re.MULTILINE)
        sections = []
        for part in parts[1:]:
            if not part.strip(): continue
            lines = part.strip().split('\n', 1)
            header = lines[0].strip()
            section_match = re.match(r'^(\d+[A-Z]*)', header)
            section_num = section_match.group(1) if section_match else "General"
            sections.append((section_num, f"Section {part.strip()}"))
        return sections
    else:
        blocks = re.split(r'\n\s*\n', content)
        return [("General", b.strip()) for b in blocks if b.strip() and len(b.split()) > 5]

def _read_file(filepath: Path) -> str:
    """Read content from a file based on its type."""
    try:
        if filepath.suffix == ".txt":
            return filepath.read_text(encoding="utf-8")
        elif filepath.suffix == ".pdf":
            from pypdf import PdfReader
            reader = PdfReader(str(filepath))
            return "\n".join(page.extract_text() for page in reader.pages)
        elif filepath.suffix == ".docx":
            from docx import Document
            doc = Document(str(filepath))
            return "\n".join(para.text for para in doc.paragraphs)
    except Exception as e:
        logger.error(f"Error reading {filepath}: {e}")
        return ""

def load_documents(data_dir: str = "../../data/raw", specific_file: str = None, act_name: str = None) -> List[dict]:
    """Load legal documents from data directory or a specific file."""
    documents = []
    
    if specific_file:
        filepath = Path(specific_file)
        if not filepath.exists():
            logger.error(f"File not found: {specific_file}")
            return []
        files_to_process = [filepath]
    else:
        data_path = Path(data_dir)
        files_to_process = [f for f in data_path.rglob("*") if f.suffix in [".pdf", ".docx", ".txt"]]

    for filepath in files_to_process:
        logger.info(f"Loading: {filepath.name}")
        content = _read_file(filepath)
        if content:
            doc_act_name = act_name if act_name else filepath.stem.replace('_', ' ').title()
            documents.append({
                "source": str(filepath), 
                "act_name": doc_act_name,
                "content": content,
                "is_txt": filepath.suffix == ".txt"
            })

    logger.info(f"Loaded {len(documents)} documents")
    return documents

def chunk_documents(documents: List[dict]) -> List[dict]:
    """Split documents into overlapping chunks for embedding."""
    chunks = []
    
    for doc in documents:
        if doc["is_txt"]:
            # Use custom section parsing for txt files
            sections = parse_sections(doc["content"])
            for section_num, section_text in sections:
                sub_chunks = chunk_text(section_text, chunk_size=1000, overlap=100)
                for chunk in sub_chunks:
                    chunks.append({
                        "source": doc["source"],
                        "act_name": doc["act_name"],
                        "section": section_num,
                        "content": chunk,
                    })
        else:
            # Fallback for pdf/docx using standard Langchain text splitter
            from langchain.text_splitter import RecursiveCharacterTextSplitter
            splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
            split_texts = splitter.split_text(doc["content"])
            for chunk in split_texts:
                chunks.append({
                    "source": doc["source"],
                    "act_name": doc["act_name"],
                    "section": "General",
                    "content": chunk,
                })
                
    logger.info(f"Created {len(chunks)} chunks from {len(documents)} documents")
    return chunks

def embed_and_store(chunks: List[dict], act_name_to_upsert: Optional[str] = None):
    """
    Embed chunks using SentenceTransformers and store them in Supabase Vector DB.
    If act_name_to_upsert is provided, any existing chunks for that act are first deleted.
    """
    from sentence_transformers import SentenceTransformer
    from supabase import create_client
    from dotenv import load_dotenv

    # Find the backend directory recursively instead of hardcoding
    current_dir = Path(__file__).resolve().parent
    env_path = current_dir.parent.parent / "backend" / ".env"
    load_dotenv(env_path)
    
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
    
    if not supabase_url or not supabase_key:
        logger.error(f"Missing Supabase credentials in {env_path}")
        return

    logger.info("Connecting to Supabase...")
    supabase = create_client(supabase_url, supabase_key)
    table_name = "legal_documents" 

    # DELETE existing records for upserting
    if act_name_to_upsert:
        logger.info(f"Upsert Mode ON: Deleting existing records for Act: '{act_name_to_upsert}'")
        try:
            # First, check if there are any records.
            response = supabase.table(table_name).select("id", count="exact").eq("act_name", act_name_to_upsert).execute()
            count = response.count if hasattr(response, 'count') else len(response.data)
            if count > 0:
                supabase.table(table_name).delete().eq("act_name", act_name_to_upsert).execute()
                logger.info(f"Deleted {count} old chunks for '{act_name_to_upsert}'.")
            else:
                logger.info(f"No existing chunks found for '{act_name_to_upsert}'. Proceeding with fresh insert.")
        except Exception as e:
            logger.error(f"Error during deletion phase: {e}")

    logger.info("Loading embedding model...")
    model = SentenceTransformer("all-MiniLM-L6-v2")

    texts = [c["content"] for c in chunks]
    logger.info(f"Embedding {len(texts)} chunks...")
    embeddings = model.encode(texts, show_progress_bar=True)
    
    records = []
    for chunk, embedding in zip(chunks, embeddings):
        records.append({
            "chunk_text": chunk["content"],
            "embedding": embedding.tolist(),
            "act_name": chunk["act_name"],
            "section": chunk["section"], 
            "title": chunk.get("title", f"{chunk['act_name']} - Section {chunk['section']}"),
        })

    logger.info(f"Uploading {len(records)} records to Supabase table '{table_name}'...")
    
    batch_size = 100
    for i in range(0, len(records), batch_size):
        batch = records[i:i + batch_size]
        try:
            supabase.table(table_name).insert(batch).execute()
            logger.info(f"Uploaded batch {i//batch_size + 1}")
        except Exception as e:
            logger.error(f"Error uploading batch: {e}")

    logger.info(f"✅ Successfully stored vectors in Supabase '{table_name}'")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Ingest legal documents into the Vector database.")
    parser.add_argument("--file", type=str, help="Path to a specific file to ingest (for upserting)")
    parser.add_argument("--act-name", type=str, help="The official name of the Act (e.g. 'New Consumer Act 2024')")
    args = parser.parse_args()

    docs = load_documents(specific_file=args.file, act_name=args.act_name)
    if not docs:
        logger.warning("No documents found to ingest.")
    else:
        chunks = chunk_documents(docs)
        
        # If a specific file/act was provided, assume we want to Upsert to prevent duplication
        # If act_name wasn't explicitly given but file was, we use the inferred act_name from docs[0]
        act_to_upsert = args.act_name if args.act_name else (docs[0]["act_name"] if args.file else None)
        
        embed_and_store(chunks, act_name_to_upsert=act_to_upsert)
