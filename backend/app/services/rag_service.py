"""
RAG Service — orchestrates retrieval + LLM generation for legal guidance.
"""

from app.core.config import settings
from app.models.schemas import GuidanceResponse, LegalStep, LegalCitation
from app.core.prompts import LEGAL_GUIDANCE_PROMPT, DOCUMENT_GENERATION_PROMPT
from loguru import logger
from typing import Optional, Dict, Any, List
import json
import os

try:
    from supabase import create_client, Client
except ImportError:
    Client = None

try:
    from sentence_transformers import SentenceTransformer
except ImportError:
    SentenceTransformer = None

try:
    from groq import Groq
except ImportError:
    Groq = None


class RAGService:
    """
    Retrieval-Augmented Generation service for legal guidance.
    Combines vector search with LLM generation to produce
    grounded, step-by-step legal guidance.
    """

    def __init__(self):
        self._supabase: Optional[Client] = None
        self._embedding_model = None
        self._groq_client = None
        logger.info("RAGService initialized (lazy loading enabled)")

    def _load_supabase(self) -> Optional[Client]:
        """Lazy-load the Supabase client."""
        if self._supabase is None:
            if settings.SUPABASE_URL and settings.SUPABASE_SERVICE_KEY and Client:
                self._supabase = create_client(
                    settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY
                )
                logger.info("Supabase client loaded")
            else:
                logger.warning("Supabase URL/Key missing, or supabase not installed.")
        return self._supabase

    def _load_embedding_model(self):
        """Lazy-load the embedding model."""
        if self._embedding_model is None:
            if SentenceTransformer:
                logger.info("Loading sentence-transformers model...")
                self._embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
            else:
                logger.warning("SentenceTransformer not available.")
        return self._embedding_model

    def _load_groq_client(self):
        """Lazy-load the Groq client."""
        if self._groq_client is None:
            if settings.GROQ_API_KEY and Groq:
                self._groq_client = Groq(api_key=settings.GROQ_API_KEY)
                logger.info("Groq client loaded")
            else:
                logger.warning("Groq API Key missing or groq not installed.")
        return self._groq_client

    def _retrieve_context(self, query: str, top_k: int = 4) -> List[Dict]:
        """Retrieve relevant legal chunks from Supabase using match_legal_documents RPC."""
        supabase = self._load_supabase()
        embedding_model = self._load_embedding_model()

        if not supabase or not embedding_model:
            return []

        try:
            query_embedding = embedding_model.encode(query).tolist()
            response = supabase.rpc(
                "match_legal_documents",
                {
                    "query_embedding": query_embedding,
                    "match_threshold": 0.3,
                    "match_count": top_k,
                },
            ).execute()
            return response.data if response.data else []
        except Exception as e:
            logger.error(f"Error querying Supabase: {e}")
            return []

    async def get_guidance(
        self,
        query: str,
        language: str = "en",
        context: Optional[str] = None,
    ) -> GuidanceResponse:
        """
        Main RAG pipeline:
        1. Retrieve relevant legal chunks from vector DB
        2. Build prompt with retrieved context
        3. Generate structured step-by-step guidance via LLM
        4. Parse and return structured response
        """
        logger.info(f"Processing guidance query [{language}]: {query[:60]}...")
        
        # 1. Retrieve
        retrieved_docs = self._retrieve_context(query)
        
        if not retrieved_docs:
            context_string = "No relevant context found in database. Provide general guidance if possible."
        else:
            context_string = "\n\n".join([
                f"Source: {chunk.get('act_name', 'Act')} Section {chunk.get('section', '')} - {chunk.get('title', '')}\nText: {chunk.get('chunk_text', '')}"
                for chunk in retrieved_docs
            ])
            
        logger.info(f"Retrieved {len(retrieved_docs)} context chunks.")

        # 2. Add extra user context if provided
        if context:
            context_string += f"\n\nADDITIONAL USER CONTEXT:\n{context}"

        # 3. Call Groq
        groq_client = self._load_groq_client()
        
        if not groq_client:
            raise Exception("Groq client is not available. Please check GROQ_API_KEY.")
            
        prompt = LEGAL_GUIDANCE_PROMPT.format(
            context=context_string,
            query=query,
            language=language
        )
        
        messages = [
            {"role": "user", "content": prompt}
        ]

        try:
            chat_completion = groq_client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=messages,
                temperature=0.2,
                max_tokens=2048,
                response_format={"type": "json_object"}
            )
            
            result_json = chat_completion.choices[0].message.content
            parsed_data = json.loads(result_json)
            
            # Map valid output to GuidanceResponse
            parsed_data["query"] = query
            parsed_data["language"] = language
            return GuidanceResponse(**parsed_data)
            
        except Exception as e:
            logger.error(f"LLM Generation Error: {e}")
            raise Exception(f"Failed to generate guidance: {str(e)}")

    async def generate_document(
        self,
        query: str,
        doc_type: Optional[str] = "fir",
        user_details: Optional[Dict[str, Any]] = None,
    ) -> Dict:
        """Generate a legal document draft (FIR, complaint, notice)."""
        logger.info(f"Generating {doc_type} document...")
        groq_client = self._load_groq_client()
        
        if not groq_client:
            return {
                "doc_type": doc_type,
                "title": f"Error: No Groq client",
                "content": "Please check GROQ_API_KEY",
                "disclaimer": "Failed to generate document."
            }
            
        prompt = DOCUMENT_GENERATION_PROMPT.format(
            doc_type=doc_type,
            query=query,
            user_details=json.dumps(user_details, indent=2) if user_details else "None provided"
        )
        
        messages = [{"role": "user", "content": prompt}]
        
        try:
            chat_completion = groq_client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=messages,
                temperature=0.3,
                max_tokens=2048,
            )
            
            content = chat_completion.choices[0].message.content
            return {
                "doc_type": doc_type,
                "title": f"{doc_type.upper()} Draft",
                "content": content.strip().replace("```", "").replace("markdown", ""),
                "disclaimer": "Review this draft with a lawyer before submission. This is AI-generated.",
            }
        except Exception as e:
            logger.error(f"Error generating document: {e}")
            raise Exception(f"Failed to generate document: {str(e)}")
