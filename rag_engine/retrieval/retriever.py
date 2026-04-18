"""
Legal Retriever — searches the FAISS vector store for relevant legal chunks.
"""

import faiss
import pickle
import numpy as np
from sentence_transformers import SentenceTransformer
from loguru import logger
from typing import List, Dict


class LegalRetriever:
    """
    Retrieves the most semantically relevant legal document chunks
    for a given user query using FAISS similarity search.
    """

    def __init__(self, index_path: str = "faiss_index", top_k: int = 5):
        self.top_k = top_k
        self.model = SentenceTransformer("all-MiniLM-L6-v2")
        self.index = faiss.read_index(f"{index_path}/legal.index")
        with open(f"{index_path}/chunks.pkl", "rb") as f:
            self.chunks = pickle.load(f)
        logger.info(f"LegalRetriever loaded with {self.index.ntotal} vectors")

    def retrieve(self, query: str) -> List[Dict]:
        """
        Retrieve the top-k most relevant legal chunks for the given query.
        Returns a list of chunk dicts with source and content.
        """
        query_embedding = self.model.encode([query]).astype("float32")
        distances, indices = self.index.search(query_embedding, self.top_k)

        results = []
        for dist, idx in zip(distances[0], indices[0]):
            if idx < len(self.chunks):
                chunk = self.chunks[idx].copy()
                chunk["score"] = float(1 / (1 + dist))
                results.append(chunk)

        logger.info(f"Retrieved {len(results)} chunks for query: {query[:50]}")
        return results

    def format_context(self, chunks: List[Dict]) -> str:
        """Format retrieved chunks into a single context string for the LLM prompt."""
        context_parts = []
        for i, chunk in enumerate(chunks, 1):
            context_parts.append(
                f"[Source {i}: {chunk.get('source', 'Unknown')}]\n{chunk['content']}"
            )
        return "\n\n---\n\n".join(context_parts)
