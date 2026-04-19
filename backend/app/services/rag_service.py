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


from app.services.search_service import SearchService

class RAGService:
    """
    Retrieval-Augmented Generation service with Live Updates and Precedents.
    """

    def __init__(self):
        self._supabase: Optional[Client] = None
        self._embedding_model = None
        self._groq_client = None
        self._search_service = SearchService()
        logger.info("RAGService initialized with Live Search capabilities")

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

    def _retrieve_context(self, query: str, top_k: int = 4, doc_type: Optional[str] = None) -> List[Dict]:
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
                    "p_doc_type": doc_type
                },
            ).execute()
            return response.data if response.data else []
        except Exception as e:
            logger.error(f"Error querying Supabase: {e}")
            return []

    async def _retrieve_hybrid_context(self, query: str) -> str:
        """
        Retrieves context from multiple sources:
        1. Local Vector DB (Statutes)
        2. Local Vector DB (Historical Case Precedents)
        3. Live Web Search (Amendments/Recent Changes)
        """
        # 1. Local Statutes
        local_statutes = self._retrieve_context(query, doc_type="statute")
        statute_context = "\n".join([
            f"STATUTE: {d.get('act_name')} Sec {d.get('section', 'N/A')} - {d.get('chunk_text', '')}"
            for d in local_statutes
        ])
        
        # 2. Historical Case Examples (Semantic Retrieval)
        local_cases = self._retrieve_context(query, doc_type="case", top_k=5)
        case_context = "\n".join([
            f"HISTORICAL CASE: {d.get('title')} ({d.get('section', 'N/A')})\nSummary: {d.get('chunk_text', '')}"
            for d in local_cases
        ])
        
        # 3. Live Updates (Amendments)
        amendments = await self._search_service.fetch_latest_amendments()
        amendment_context = "\n".join([
            f"LATEST ENROLLMENT/UPDATE: {a['title']} (Ref: {a['date']})"
            for a in amendments
        ]) if amendments else ""

        return f"""
STRICT STATUTORY LAW:
{statute_context}

LATEST LEGAL UPDATES/AMENDMENTS:
{amendment_context}

HISTORICAL CASE EXAMPLES (PRECEDENTS):
{case_context}
"""

    async def get_guidance(
        self,
        query: str,
        language: str = "en",
        context: Optional[str] = None,
        attachments: Optional[str] = None,
    ) -> GuidanceResponse:
        """
        Upgraded RAG pipeline with Live Search, Precedents, and Document Intelligence.
        """
        logger.info(f"Generating hybrid guidance for: {query[:60]}...")
        
        # 1. Retrieve Hybrid Context
        context_string = await self._retrieve_hybrid_context(query)
        
        if context:
            context_string += f"\n\nADDITIONAL USER CONTEXT:\n{context}"

        # 2. Call Groq
        groq_client = self._load_groq_client()
        if not groq_client:
            raise Exception("Groq client not available")
            
        prompt = LEGAL_GUIDANCE_PROMPT.format(
            context=context_string,
            attachments=attachments or "No documents uploaded by user.",
            query=query,
            language=language
        )
        
        messages = [
            {"role": "user", "content": prompt}
        ]

        try:
            chat_completion = groq_client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=messages,
                temperature=0.2,
                max_tokens=4096,
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
                model="llama-3.3-70b-versatile",
                messages=messages,
                temperature=0.3,
                max_tokens=4096,
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
