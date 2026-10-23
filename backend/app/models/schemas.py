from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

# --- Nutrition Schemas ---
class NutrientInfo(BaseModel):
    calories: float = Field(..., description="Total kcal")
    protein_g: float = Field(..., description="Protein in grams")
    carbs_g: float = Field(..., description="Carbohydrates in grams")
    fat_g: float = Field(..., description="Fats in grams")
    fiber_g: float = Field(..., description="Dietary fiber in grams")
    sugar_g: float = Field(0.0, description="Sugars in grams")
    sodium_mg: float = Field(0.0, description="Sodium in milligrams")

class RecognizedFoodItem(BaseModel):
    name: str
    confidence: float
    estimated_weight_g: float
    nutrients: NutrientInfo
    dietary_tags: List[str] = []  # e.g., "Vegan", "High-Protein", "Gluten-Free"
    glycemic_index: str  # "Low", "Medium", "High"

class NutritionAnalysisResponse(BaseModel):
    id: Optional[int] = None
    dish_name: str
    total_nutrients: NutrientInfo
    items: List[RecognizedFoodItem]
    health_score: int = Field(..., ge=0, le=100, description="Nutri-Score derived score 0-100")
    health_rating: str  # "A (Excellent)", "B (Good)", etc.
    dietary_compliance: Dict[str, bool]  # {"vegan": True, "keto": False, etc.}
    dietitian_recommendation: str
    analyzed_at: str

# --- Freshness Schemas ---
class SpoilageIndicator(BaseModel):
    name: str  # e.g., "Color Discoloration", "Fungal Growth", "Moisture Loss"
    detected: bool
    severity: str  # "None", "Mild", "Moderate", "Severe"
    details: str

class FreshnessAnalysisResponse(BaseModel):
    id: Optional[int] = None
    item_name: str
    freshness_score: int = Field(..., ge=0, le=100, description="Freshness percentage")
    status: str  # "Fresh & Prime", "Safe - Consume Soon", "Spoiled / Discard"
    indicators: List[SpoilageIndicator]
    estimated_shelf_life_days: float
    spoilage_risk: str  # "Low", "Medium", "Critical"
    storage_recommendation: str
    consumption_safety_verdict: str
    analyzed_at: str

# --- Hygiene & Safety Schemas ---
class HygieneViolation(BaseModel):
    category: str  # "PPE Compliance", "Cross-Contamination", "Sanitation", "Pest Risk"
    severity: str  # "Critical", "Major", "Minor"
    description: str
    timestamp_or_zone: str
    suggested_action: str

class HygieneAuditResponse(BaseModel):
    id: Optional[int] = None
    zone_or_station: str
    hygiene_score: int = Field(..., ge=0, le=100)
    grade: str  # "Grade A (Optimal)", "Grade B", "Grade C", "Grade F"
    ppe_compliance: Dict[str, bool]  # {"hairnets": True, "gloves": False, "masks": True}
    cross_contamination_risk: str  # "Low", "Moderate", "High"
    sanitization_level: str  # "Compliant", "Needs Cleaning", "Unsanitary"
    violations: List[HygieneViolation]
    overall_verdict: str
    analyzed_at: str

# --- Smart Cooking & Assistant Schemas ---
class RecipeIngredient(BaseModel):
    item: str
    amount: str
    substitute_hint: Optional[str] = None

class RecipeStep(BaseModel):
    step_number: int
    instruction: str
    time_minutes: Optional[int] = None
    safety_tip: Optional[str] = None

class SmartRecipe(BaseModel):
    recipe_name: str
    prep_time_minutes: int
    cook_time_minutes: int
    servings: int
    difficulty: str  # "Easy", "Intermediate", "Advanced"
    ingredients: List[RecipeIngredient]
    instructions: List[RecipeStep]
    nutrition_per_serving: NutrientInfo
    chef_tips: List[str]

class RecipeRequest(BaseModel):
    ingredients: List[str] = []
    dietary_preference: Optional[str] = "None"
    cuisine_type: Optional[str] = "Any"
    cooking_skill: Optional[str] = "Beginner"

class CookingAssistantChatRequest(BaseModel):
    message: str
    current_recipe: Optional[str] = None
    history: List[Dict[str, str]] = []

class CookingAssistantChatResponse(BaseModel):
    reply: str
    suggested_substitutions: Optional[List[Dict[str, str]]] = None
    quick_tips: List[str] = []

# --- Meal Planner Schemas ---
class DailyMealPlan(BaseModel):
    day: str
    breakfast: str
    lunch: str
    dinner: str
    snacks: str
    total_calories: int
    protein_g: int
    carbs_g: int
    fat_g: int

class MealPlanRequest(BaseModel):
    calorie_target: int = 2000
    goal: str = "Maintenance"  # "Weight Loss", "Muscle Gain", "Maintenance", "Endurance"
    diet_type: str = "Balanced"  # "Balanced", "Keto", "High-Protein", "Vegan", "Mediterranean"
    allergies: List[str] = []
    days_count: int = 7

class MealPlanResponse(BaseModel):
    goal: str
    diet_type: str
    daily_plans: List[DailyMealPlan]
    weekly_summary: str
    shopping_list: List[str]
