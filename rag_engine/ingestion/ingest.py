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


def embed_and_store(chunks: List[dict], index_path: str = "faiss_index"):
    """
    Embed chunks using SentenceTransformers and store in FAISS vector DB.
    """
    from sentence_transformers import SentenceTransformer
    import faiss
    import numpy as np
    import pickle

    logger.info("Loading embedding model...")
    model = SentenceTransformer("all-MiniLM-L6-v2")

    texts = [c["content"] for c in chunks]
    logger.info(f"Embedding {len(texts)} chunks...")
    embeddings = model.encode(texts, show_progress_bar=True)

    dim = embeddings.shape[1]
    index = faiss.IndexFlatL2(dim)
    index.add(np.array(embeddings).astype("float32"))

    # Save index + metadata
    os.makedirs(index_path, exist_ok=True)
    faiss.write_index(index, f"{index_path}/legal.index")
    with open(f"{index_path}/chunks.pkl", "wb") as f:
        pickle.dump(chunks, f)

    logger.info(f"✅ Stored {len(chunks)} vectors in FAISS at '{index_path}'")


if __name__ == "__main__":
    docs = load_documents()
    chunks = chunk_documents(docs)
    embed_and_store(chunks)
