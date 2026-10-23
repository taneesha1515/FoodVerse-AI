from fastapi import APIRouter
from app.services.cooking_service import cooking_service
from app.models.schemas import MealPlanRequest, MealPlanResponse

router = APIRouter(prefix="/meal-planner", tags=["Personalized Nutrition Planner"])

@router.post("/generate", response_model=MealPlanResponse)
def generate_meal_plan(req: MealPlanRequest):
    return cooking_service.generate_meal_plan(req)
