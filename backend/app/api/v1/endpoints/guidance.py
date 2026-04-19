"""
Legal Guidance API Endpoint
Handles user queries and returns structured step-by-step legal guidance.
"""

from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import StreamingResponse
from app.models.schemas import GuidanceRequest, GuidanceResponse, PDFRequest
from app.services.rag_service import RAGService
from app.utils.location_helper import get_location_guidance
from app.utils.pdf_generator import create_legal_pdf
from app.document_generator import generate_document
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
    - Optionally enriches response with location-aware authority guidance
    """
    try:
        logger.info(f"Received query: {request.query[:80]}...")
        result = await rag_service.get_guidance(
            query=request.query,
            language=request.language,
            context=request.context,
        )

        # --- Location guidance (fail-safe: never breaks existing response) ---
        location_guidance = None
        try:
            if request.city:
                location_guidance = get_location_guidance(
                    city=request.city,
                    query=request.query,
                )
        except Exception:
            pass  # Always silent — location is optional

        result.location_guidance = location_guidance
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
        logger.info(f"Generating {request.doc_type} document...")
        
        # Prepare data for the generator
        data = request.user_details or {}
        if "description" not in data:
            data["description"] = request.query
        if "context" not in data:
            data["context"] = request.context
            
        result = await generate_document(
            doc_type=request.doc_type,
            data=data,
            language=request.language
        )
        
        # --- OPTIONAL: Add location guidance (fail-safe, does not affect existing fields) ---
        try:
            city = (data.get("location") or data.get("address") or "").split(",")[0].strip()
            location_guidance = get_location_guidance(
                city=city,
                query=request.query,
                doc_type=request.doc_type
            )
            result["location_guidance"] = location_guidance  # None if not found — that's fine
        except Exception:
            pass  # Never break existing flow
        
        return result
    except Exception as e:
        logger.error(f"Error generating document: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/download-pdf")
async def download_document_pdf(request: PDFRequest):
    """
    Convert the generated document text into a downloadable PDF file.
    """
    try:
        logger.info(f"Generating PDF for: {request.filename}")
        pdf_stream = create_legal_pdf(request.content)
        
        return StreamingResponse(
            pdf_stream,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={request.filename}.pdf"}
        )
    except Exception as e:
        logger.error(f"PDF download error: {e}")
        raise HTTPException(status_code=500, detail="Could not generate PDF")
