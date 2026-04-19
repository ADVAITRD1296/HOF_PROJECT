"""
Legal Guidance API Endpoint
Handles user queries and returns structured step-by-step legal guidance.
"""

from fastapi import APIRouter, HTTPException, BackgroundTasks, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from typing import List, Optional, Union
from app.models.schemas import GuidanceRequest, GuidanceResponse, PDFRequest
from app.services.rag_service import RAGService
from app.utils.location_helper import get_location_guidance
from app.utils.pdf_generator import create_legal_pdf
from app.document_generator import generate_document
from app.utils.document_parser import process_attached_files
from loguru import logger

router = APIRouter()
rag_service = RAGService()

@router.post("/ask", response_model=GuidanceResponse)
async def ask_legal_question(
    query: str = Form(...),
    language: str = Form("en"),
    city: Optional[str] = Form(None),
    context: Optional[str] = Form(None),
    files: Optional[Union[List[UploadFile], UploadFile]] = File(None)
):
    """
    Main endpoint: accepts a legal query and optional documents for analysis.
    """
    try:
        logger.info(f"Received query: {query[:80]}...")
        
        # Normalization to handle single vs multi-file uploads (Common Pydantic v2 strictness fix)
        if files and not isinstance(files, list):
            files = [files]
            
        # Process attached files for intelligence
        aggregated_file_context = ""
        if files:
            file_data = []
            for file in files:
                content = await file.read()
                file_data.append((file.filename, content))
            aggregated_file_context = process_attached_files(file_data)
            logger.info(f"Extracted intelligence from {len(files)} files")

        # Combination remains for backward compatibility in logs, but we pass them separately now
        result = await rag_service.get_guidance(
            query=query,
            language=language,
            context=context,
            attachments=aggregated_file_context
        )

        # Ensure result query is the original clean query for UI
        result.query = query

        # --- Location guidance (fail-safe) ---
        location_guidance = None
        try:
            if city:
                location_guidance = get_location_guidance(
                    city=city,
                    query=query,
                )
        except Exception:
            pass 

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


@router.post("/location-only")
async def get_standalone_location_guidance(request: GuidanceRequest):
    """
    Returns only jurisdictional data (police, courts, helplines) for a specific city.
    """
    try:
        if not request.city:
            raise HTTPException(status_code=400, detail="City is required for location guidance")
            
        location_data = get_location_guidance(
            city=request.city,
            query=request.query or "",
            doc_type=request.doc_type or ""
        )
        
        return location_data
    except Exception as e:
        logger.error(f"Error in standalone location guidance: {e}")
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
