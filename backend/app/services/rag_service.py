"""
RAG Service — orchestrates retrieval + LLM generation for legal guidance.
"""

from app.core.config import settings
from app.models.schemas import GuidanceResponse, LegalStep, LegalCitation
from loguru import logger
from typing import Optional, Dict, Any


class RAGService:
    """
    Retrieval-Augmented Generation service for legal guidance.
    Combines vector search with LLM generation to produce
    grounded, step-by-step legal guidance.
    """

    def __init__(self):
        self._llm = None
        self._retriever = None
        logger.info("RAGService initialized (lazy loading enabled)")

    def _load_llm(self):
        """Lazy-load the Groq LLM client."""
        if self._llm is None:
            from langchain_groq import ChatGroq
            self._llm = ChatGroq(
                api_key=settings.GROQ_API_KEY,
                model_name="llama3-70b-8192",
                temperature=0.2,
            )
            logger.info("Groq LLM loaded")
        return self._llm

    def _load_retriever(self):
        """Lazy-load the vector store retriever."""
        if self._retriever is None:
            from rag_engine.retrieval.retriever import LegalRetriever
            self._retriever = LegalRetriever()
            logger.info("Legal retriever loaded")
        return self._retriever

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

        # TODO: Replace with actual RAG pipeline once vector DB is set up
        # Placeholder structured response for development
        return GuidanceResponse(
            query=query,
            language=language,
            summary=(
                "Based on your situation, this appears to involve a legal dispute "
                "that can be addressed through the following steps."
            ),
            steps=[
                LegalStep(
                    step_number=1,
                    title="Understand Your Situation",
                    description="Document all relevant facts, dates, and evidence related to your case.",
                    action_required="Gather all documents, messages, receipts, and any relevant evidence.",
                ),
                LegalStep(
                    step_number=2,
                    title="Identify the Applicable Law",
                    description="Based on your query, relevant laws have been identified.",
                    action_required="Review the cited sections below.",
                ),
                LegalStep(
                    step_number=3,
                    title="Take Initial Action",
                    description="Send a formal notice to the other party before filing any complaint.",
                    action_required="Send a written legal notice via registered post.",
                ),
                LegalStep(
                    step_number=4,
                    title="File a Formal Complaint",
                    description="If the issue is unresolved, escalate to the appropriate authority.",
                    action_required="File a complaint with the relevant forum or police station.",
                ),
            ],
            citations=[
                LegalCitation(
                    act="Indian Penal Code (IPC)",
                    section="Section 406",
                    description="Criminal breach of trust",
                    why_applicable="Applicable when someone misappropriates property entrusted to them.",
                ),
            ],
            suggested_actions=[
                "Generate a legal notice",
                "Draft an FIR",
                "Find the nearest consumer forum",
                "Consult a lawyer",
            ],
        )

    async def generate_document(
        self,
        query: str,
        doc_type: Optional[str] = "fir",
        user_details: Optional[Dict[str, Any]] = None,
    ) -> Dict:
        """Generate a legal document draft (FIR, complaint, notice)."""
        logger.info(f"Generating {doc_type} document...")
        # TODO: Implement with actual LLM generation
        return {
            "doc_type": doc_type,
            "title": f"{doc_type.upper()} Draft",
            "content": "Document generation coming soon. Connect LLM to enable this feature.",
            "disclaimer": "Review this draft with a lawyer before submission.",
        }
