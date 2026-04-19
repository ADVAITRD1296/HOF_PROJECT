"""
Utility for parsing documents (PDF, Images) into text for legal analysis.
"""

import io
from loguru import logger
from typing import List, Optional

try:
    from pypdf import PdfReader
except ImportError:
    PdfReader = None

try:
    from PIL import Image
except ImportError:
    Image = None

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract text from a PDF file."""
    if not PdfReader:
        logger.warning("pypdf not installed. Cannot parse PDF.")
        return ""
    
    try:
        reader = PdfReader(io.BytesIO(file_bytes))
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text.strip()
    except Exception as e:
        logger.error(f"Error parsing PDF: {e}")
        return ""

def extract_text_from_image(file_bytes: bytes) -> str:
    """
    Placeholder for Image OCR. 
    In future, could use pytesseract or a multimodal LLM.
    For now, returns a note that OCR is pending.
    """
    return "[Image Attachment: OCR capability is currently being upgraded for military-grade accuracy. Please describe the image content for now.]"

def process_attached_files(files: List[tuple]) -> str:
    """
    Process a list of FastAPI UploadFiles and return aggregated text context.
    'files' is expected to be a list of (filename, content_bytes) tuples.
    """
    combined_context = ""
    for idx, (filename, content) in enumerate(files, 1):
        combined_context += f"\n[DOCUMENT {idx}: {filename}]\n"
        if filename.lower().endswith('.pdf'):
            combined_context += extract_text_from_pdf(content)
        elif filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            combined_context += extract_text_from_image(content)
        else:
            try:
                combined_context += content.decode('utf-8', errors='ignore')
            except:
                combined_context += "[Unreadable text format]"
        combined_context += "\n--- END OF DOCUMENT {idx} ---\n"
    
    return combined_context
