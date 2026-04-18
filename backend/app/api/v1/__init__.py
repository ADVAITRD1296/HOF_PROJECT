from fastapi import APIRouter
from app.api.v1.endpoints import guidance, documents, health

router = APIRouter()
router.include_router(health.router, prefix="/health", tags=["Health"])
router.include_router(guidance.router, prefix="/guidance", tags=["Legal Guidance"])
router.include_router(documents.router, prefix="/documents", tags=["Documents"])
