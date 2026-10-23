from fastapi import APIRouter, UploadFile, File, Form
from typing import Optional
from app.services.freshness_service import freshness_service, SAMPLE_FRESHNESS_ITEMS
from app.models.schemas import FreshnessAnalysisResponse
from app.database import save_scan_record

router = APIRouter(prefix="/freshness", tags=["Food Freshness & Spoilage Detection"])

@router.get("/samples")
def get_freshness_samples():
    return [
        {"id": key, "name": val["item_name"], "freshness_score": val["freshness_score"], "status": val["status"]}
        for key, val in SAMPLE_FRESHNESS_ITEMS.items()
    ]

@router.post("/inspect", response_model=FreshnessAnalysisResponse)
async def inspect_freshness(
    file: Optional[UploadFile] = File(None),
    sample_id: Optional[str] = Form(None)
):
    image_bytes = None
    if file:
        image_bytes = await file.read()

    result = freshness_service.inspect_freshness(image_bytes=image_bytes, sample_id=sample_id)
    
    rec_id = save_scan_record(
        module="freshness",
        title=result.item_name,
        summary=f"Freshness: {result.freshness_score}% | {result.status}",
        data=result.model_dump(),
        image_url=file.filename if file else f"sample_{sample_id}.jpg"
    )
    result.id = rec_id
    return result
