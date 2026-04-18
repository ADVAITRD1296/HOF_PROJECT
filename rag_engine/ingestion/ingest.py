"""
Legal Document Ingestion Pipeline
Loads PDFs/DOCX → chunks → embeds → stores in vector DB
"""

import os
from pathlib import Path
from loguru import logger
from typing import List


def load_documents(data_dir: str = "../../data/raw") -> List[dict]:
    """
    Load all legal documents from the raw data directory.
    Supports: PDF, DOCX, TXT
    """
    data_path = Path(data_dir)
    documents = []

    for filepath in data_path.rglob("*"):
        if filepath.suffix in [".pdf", ".docx", ".txt"]:
            logger.info(f"Loading: {filepath.name}")
            doc = {"source": str(filepath), "content": _read_file(filepath)}
            if doc["content"]:
                documents.append(doc)

    logger.info(f"Loaded {len(documents)} documents")
    return documents


def _read_file(filepath: Path) -> str:
    """Read content from a file based on its type."""
    try:
        if filepath.suffix == ".txt":
            return filepath.read_text(encoding="utf-8")
        elif filepath.suffix == ".pdf":
            # pip install pypdf
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


def chunk_documents(documents: List[dict], chunk_size: int = 500, overlap: int = 50) -> List[dict]:
    """
    Split documents into overlapping chunks for embedding.
    """
    from langchain.text_splitter import RecursiveCharacterTextSplitter
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=overlap,
    )
    chunks = []
    for doc in documents:
        split_texts = splitter.split_text(doc["content"])
        for i, chunk in enumerate(split_texts):
            chunks.append({
                "source": doc["source"],
                "chunk_id": i,
                "content": chunk,
            })
    logger.info(f"Created {len(chunks)} chunks from {len(documents)} documents")
    return chunks


def embed_and_store(chunks: List[dict]):
    """
    Embed chunks using SentenceTransformers and store them in Supabase Vector DB.
    Requires SUPABASE_URL and SUPABASE_SERVICE_KEY in .env
    """
    from sentence_transformers import SentenceTransformer
    from supabase import create_client
    from dotenv import load_dotenv

    load_dotenv("../../backend/.env")
    
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
    
    if not supabase_url or not supabase_key:
        logger.error("Missing Supabase credentials in .env file.")
        return

    logger.info("Connecting to Supabase...")
    supabase = create_client(supabase_url, supabase_key)

    logger.info("Loading embedding model...")
    model = SentenceTransformer("all-MiniLM-L6-v2")

    texts = [c["content"] for c in chunks]
    logger.info(f"Embedding {len(texts)} chunks...")
    embeddings = model.encode(texts, show_progress_bar=True)

    # Insert into Supabase table
    # Note: Replace 'legal_documents' with your actual table name if different.
    table_name = "legal_documents" 
    
    records = []
    for chunk, embedding in zip(chunks, embeddings):
        records.append({
            "chunk_text": chunk["content"],
            "embedding": embedding.tolist(),
            "act_name": chunk.get("source", "Unknown"),
            "section": "General", 
            "title": "Document Section",
        })

    logger.info(f"Uploading {len(records)} records to Supabase table '{table_name}'...")
    
    # Upload in batches of 100
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
    docs = load_documents()
    if not docs:
        logger.warning("No documents found in data/raw to ingest.")
    else:
        chunks = chunk_documents(docs)
        embed_and_store(chunks)
