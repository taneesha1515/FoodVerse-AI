from fastapi import APIRouter
from app.services.cooking_service import cooking_service, SUBSTITUTION_DATABASE
from app.models.schemas import (
    SmartRecipe, RecipeRequest,
    CookingAssistantChatRequest, CookingAssistantChatResponse
)

router = APIRouter(prefix="/cooking", tags=["Smart Cooking Assistant"])

@router.post("/recipe", response_model=SmartRecipe)
def generate_recipe(req: RecipeRequest):
    return cooking_service.generate_smart_recipe(req)

@router.post("/chat", response_model=CookingAssistantChatResponse)
def cooking_chat(req: CookingAssistantChatRequest):
    return cooking_service.chat_with_assistant(req)

@router.get("/substitutions")
def get_all_substitutions():
    return SUBSTITUTION_DATABASE
