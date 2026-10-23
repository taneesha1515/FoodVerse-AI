from fastapi import APIRouter, UploadFile, File, Form
from typing import Optional
from app.services.hygiene_service import hygiene_service, SAMPLE_HYGIENE_ZONES
from app.models.schemas import HygieneAuditResponse
from app.database import save_scan_record

router = APIRouter(prefix="/hygiene", tags=["Restaurant Hygiene & Safety"])

@router.get("/samples")
def get_hygiene_samples():
    return [
        {"id": key, "name": val["zone_or_station"], "grade": val["grade"], "score": val["hygiene_score"]}
        for key, val in SAMPLE_HYGIENE_ZONES.items()
    ]

@router.post("/audit", response_model=HygieneAuditResponse)
async def audit_kitchen(
    file: Optional[UploadFile] = File(None),
    sample_id: Optional[str] = Form(None)
):
    image_bytes = None
    if file:
        image_bytes = await file.read()

    result = hygiene_service.audit_hygiene(image_bytes=image_bytes, sample_id=sample_id)
    
    rec_id = save_scan_record(
        module="hygiene",
        title=result.zone_or_station,
        summary=f"{result.grade} | Score: {result.hygiene_score}%",
        data=result.model_dump(),
        image_url=file.filename if file else f"sample_{sample_id}.jpg"
    )
    result.id = rec_id
    return result
