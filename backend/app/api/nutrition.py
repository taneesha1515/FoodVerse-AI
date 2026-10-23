from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
from app.services.nutrition_service import nutrition_service, SAMPLE_NUTRITION_DISHES
from app.models.schemas import NutritionAnalysisResponse
from app.database import save_scan_record

router = APIRouter(prefix="/nutrition", tags=["Food Recognition & Nutrition"])

@router.get("/samples")
def get_nutrition_samples():
    """Return available sample dishes for quick one-click testing"""
    return [
        {"id": key, "name": val["dish_name"], "calories": val["total_nutrients"]["calories"], "rating": val["health_rating"]}
        for key, val in SAMPLE_NUTRITION_DISHES.items()
    ]

@router.post("/analyze", response_model=NutritionAnalysisResponse)
async def analyze_food(
    file: Optional[UploadFile] = File(None),
    sample_id: Optional[str] = Form(None)
):
    image_bytes = None
    if file:
        image_bytes = await file.read()

    result = nutrition_service.analyze_food_image(image_bytes=image_bytes, sample_id=sample_id)
    
    # Save record to database
    rec_id = save_scan_record(
        module="nutrition",
        title=result.dish_name,
        summary=f"{result.total_nutrients.calories} kcal | Score {result.health_score}/100",
        data=result.model_dump(),
        image_url=file.filename if file else f"sample_{sample_id}.jpg"
    )
    result.id = rec_id
    return result
