from fastapi import APIRouter, HTTPException, Depends
from typing import List
from pydantic import BaseModel
from app.services.case_service import CaseService

router = APIRouter()

class CaseCreate(BaseModel):
    user_id: str
    title: str
    description: str
    metadata: dict = {}

def get_case_service():
    return CaseService()

@router.post("/")
async def create_case(request: CaseCreate, service: CaseService = Depends(get_case_service)):
    try:
        return await service.create_case(request.user_id, request.title, request.description, request.metadata)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{user_id}")
async def get_user_cases(user_id: str, service: CaseService = Depends(get_case_service)):
    try:
        return await service.get_user_cases(user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
class CaseUpdate(BaseModel):
    metadata: dict

@router.patch("/{case_id}")
async def update_case(case_id: str, request: CaseUpdate, service: CaseService = Depends(get_case_service)):
    try:
        return await service.update_case(case_id, request.metadata)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
