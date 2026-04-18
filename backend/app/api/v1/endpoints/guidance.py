"""
Legal Guidance API Endpoint
Handles user queries and returns structured step-by-step legal guidance.
"""

from fastapi import APIRouter, HTTPException, BackgroundTasks
from app.models.schemas import GuidanceRequest, GuidanceResponse
from app.services.rag_service import RAGService
from loguru import logger

router = APIRouter()
rag_service = RAGService()


@router.post("/ask", response_model=GuidanceResponse)
async def ask_legal_question(request: GuidanceRequest):
    """
    Main endpoint: accepts a legal query and returns structured guidance.
    - Retrieves relevant legal context via RAG
    - Generates step-by-step guidance using LLM
    - Returns citations, steps, and suggested next actions
    """
    try:
        logger.info(f"Received query: {request.query[:80]}...")
        result = await rag_service.get_guidance(
            query=request.query,
            language=request.language,
            context=request.context,
        )
        return result
    except Exception as e:
        logger.error(f"Error processing guidance request: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-document")
async def generate_legal_document(request: GuidanceRequest):
    """
    Generate a FIR draft, consumer complaint, or legal notice
    based on the user's described situation.
    """
    try:
        result = await rag_service.generate_document(
            query=request.query,
            doc_type=request.doc_type,
            user_details=request.user_details,
        )
        return result
    except Exception as e:
        logger.error(f"Error generating document: {e}")
        raise HTTPException(status_code=500, detail=str(e))
