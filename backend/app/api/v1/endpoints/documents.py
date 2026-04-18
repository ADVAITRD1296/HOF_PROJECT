"""
Document management endpoint — upload legal PDFs for RAG ingestion.
"""

from fastapi import APIRouter, UploadFile, File, HTTPException
from loguru import logger

router = APIRouter()


@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    """Upload a legal document (PDF/DOCX) to be indexed into the vector DB."""
    if not file.filename.endswith((".pdf", ".docx", ".txt")):
        raise HTTPException(status_code=400, detail="Only PDF, DOCX, and TXT files are supported.")
    try:
        content = await file.read()
        logger.info(f"Received file: {file.filename} ({len(content)} bytes)")
        # TODO: Pass to ingestion pipeline
        return {"filename": file.filename, "status": "queued_for_ingestion", "size": len(content)}
    except Exception as e:
        logger.error(f"Upload error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/list")
async def list_documents():
    """List all indexed legal documents in the vector store."""
    # TODO: Pull from vector DB metadata
    return {"documents": [], "message": "Document listing coming soon"}
