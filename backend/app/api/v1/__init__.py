from fastapi import APIRouter
from app.api.v1.endpoints import guidance, documents, health, lawyers, auth, admin, extensions

router = APIRouter()
router.include_router(health.router, prefix="/health", tags=["Health"])
router.include_router(guidance.router, prefix="/guidance", tags=["Legal Guidance"])
router.include_router(documents.router, prefix="/documents", tags=["Documents"])
router.include_router(lawyers.router, prefix="/lawyers", tags=["Lawyers"])
router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
router.include_router(admin.router, prefix="/admin", tags=["Admin"])
router.include_router(extensions.router, prefix="", tags=["Extended Features"])
