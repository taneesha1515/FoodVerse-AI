import json
from datetime import datetime
from typing import List, Dict, Any, Optional
from app.services.ai_service import ai_service
from app.models.schemas import (
    SmartRecipe, RecipeIngredient, RecipeStep, NutrientInfo,
    RecipeRequest, CookingAssistantChatRequest, CookingAssistantChatResponse,
    MealPlanRequest, MealPlanResponse, DailyMealPlan
)

SUBSTITUTION_DATABASE = {
    "egg": [
        {"substitute": "Flax egg (1 tbsp ground flaxseed + 3 tbsp warm water)", "best_for": "Baking, binding cookies and quick breads"},
        {"substitute": "Silken Tofu (1/4 cup pureed)", "best_for": "Dense cakes, brownies, custard textures"},
        {"substitute": "Aquafaba (3 tbsp chickpea brine)", "best_for": "Meringues, light batters, vegan macarons"}
    ],
    "buttermilk": [
        {"substitute": "1 cup whole milk + 1 tbsp fresh lemon juice or white vinegar (let sit 5 min)", "best_for": "Pancakes, biscuits, marinades"},
        {"substitute": "3/4 cup plain Greek yogurt + 1/4 cup milk", "best_for": "Rich baking, waffle batter"}
    ],
    "all-purpose flour": [
        {"substitute": "1:1 Gluten-Free 1-to-1 Baking Blend (e.g. Bob's Red Mill)", "best_for": "Cookies, cakes, pancakes"},
        {"substitute": "Almond flour (1 cup almond flour + 1/2 tsp xanthan gum)", "best_for": "Keto, low-carb baking"}
    ],
    "heavy cream": [
        {"substitute": "Full-fat coconut cream (chilled top layer)", "best_for": "Curries, vegan soups, whipped topping"},
        {"substitute": "3/4 cup whole milk + 1/4 cup melted unsalted butter", "best_for": "Pasta sauces, pan sauces"}
    ],
    "soy sauce": [
        {"substitute": "Coconut Aminos", "best_for": "Soy-free, paleo, low-sodium savory glazing"},
        {"substitute": "Tamari (gluten-free brewed soy sauce)", "best_for": "Gluten-free marinades, stir-fry"}
    ],
    "butter": [
        {"substitute": "Extra virgin olive oil (3/4 tbsp per 1 tbsp butter)", "best_for": "Sautéing, Mediterranean roasts, rustic breads"},
        {"substitute": "Avocado oil or Coconut oil", "best_for": "High heat searing, vegan pastries"}
    ]
}

class CookingService:
    def generate_smart_recipe(self, req: RecipeRequest) -> SmartRecipe:
        ingredients_list = ", ".join(req.ingredients) if req.ingredients else "chicken breast, olive oil, garlic, lemon, rosemary, broccoli"

        if ai_service.has_gemini_key():
            prompt = f"""
            You are FoodVerse AI Chef, a culinary master and nutritional scientist.
            Create a gourmet, step-by-step smart recipe using these primary ingredients: {ingredients_list}.
            Dietary Preference: {req.dietary_preference}
            Cuisine Type: {req.cuisine_type}
            Cooking Skill: {req.cooking_skill}

            Return ONLY a valid JSON object matching this schema:
            {{
                "recipe_name": "Gourmet Dish Name",
                "prep_time_minutes": 15,
                "cook_time_minutes": 25,
                "servings": 2,
                "difficulty": "Easy" | "Intermediate" | "Advanced",
                "ingredients": [
                    {{"item": "Ingredient Name", "amount": "Quantity", "substitute_hint": "Optional substitute"}}
                ],
                "instructions": [
                    {{"step_number": 1, "instruction": "Step instruction", "time_minutes": 5, "safety_tip": "Chef tip or safety check"}}
                ],
                "nutrition_per_serving": {{
                    "calories": 450.0,
                    "protein_g": 35.0,
                    "carbs_g": 20.0,
                    "fat_g": 18.0,
                    "fiber_g": 5.0,
                    "sugar_g": 2.0,
                    "sodium_mg": 380.0
                }},
                "chef_tips": ["Pro tip 1", "Pro tip 2"]
            }}
            """
            ai_resp = ai_service.call_gemini_multimodal(prompt)
            if ai_resp:
                try:
                    clean_json = ai_resp.strip()
                    if clean_json.startswith("```json"):
                        clean_json = clean_json[7:]
                    if clean_json.endswith("```"):
                        clean_json = clean_json[:-3]
                    parsed = json.loads(clean_json.strip())
                    return SmartRecipe(
                        recipe_name=parsed.get("recipe_name", "Chef's Signature Creation"),
                        prep_time_minutes=parsed.get("prep_time_minutes", 15),
                        cook_time_minutes=parsed.get("cook_time_minutes", 20),
                        servings=parsed.get("servings", 2),
                        difficulty=parsed.get("difficulty", "Easy"),
                        ingredients=[RecipeIngredient(**ing) for ing in parsed.get("ingredients", [])],
                        instructions=[RecipeStep(**step) for step in parsed.get("instructions", [])],
                        nutrition_per_serving=NutrientInfo(**parsed.get("nutrition_per_serving", {})),
                        chef_tips=parsed.get("chef_tips", [])
                    )
                except Exception as e:
                    print(f"[CookingService] Gemini recipe JSON parse error: {e}")

        # Domain fallback recipe
        return SmartRecipe(
            recipe_name="Lemon-Herb Pan-Seared Chicken & Charred Broccoli",
            prep_time_minutes=12,
            cook_time_minutes=18,
            servings=2,
            difficulty="Easy",
            ingredients=[
                RecipeIngredient(item="Free-Range Chicken Breast", amount="2 fillets (approx 350g)", substitute_hint="Firm pressed tofu or portobello caps for vegan option"),
                RecipeIngredient(item="Fresh Broccoli Florets", amount="2 cups (200g)", substitute_hint="Asparagus spears or snap peas"),
                RecipeIngredient(item="Extra Virgin Olive Oil", amount="2 tbsp", substitute_hint="Avocado oil"),
                RecipeIngredient(item="Fresh Garlic Cloves", amount="3 cloves, minced", substitute_hint="1/2 tsp garlic powder"),
                RecipeIngredient(item="Fresh Lemon", amount="1 whole (juice & zest)", substitute_hint="White wine vinegar or lime"),
                RecipeIngredient(item="Fresh Rosemary & Thyme", amount="1 tbsp chopped", substitute_hint="Dried Italian herb seasoning")
            ],
            instructions=[
                RecipeStep(step_number=1, instruction="Pat chicken fillets dry with a paper towel. Season both sides evenly with sea salt, freshly cracked black pepper, minced garlic, and fresh thyme.", time_minutes=3, safety_tip="Always use a designated poultry board and wash hands immediately with soap."),
                RecipeStep(step_number=2, instruction="Heat 1.5 tbsp olive oil in a heavy stainless steel or cast iron skillet over medium-high heat until shimmering.", time_minutes=2, safety_tip="Oil should be hot but not smoking to prevent polycyclic aromatic hydrocarbon formation."),
                RecipeStep(step_number=3, instruction="Gently lay chicken fillets in pan. Sear undisturbed for 6-7 minutes until golden brown crust forms, then flip and cook for another 5-6 minutes until internal temp reaches 165°F (74°C).", time_minutes=12, safety_tip="Verify doneness with a digital meat thermometer in the thickest part of the fillet."),
                RecipeStep(step_number=4, instruction="Remove chicken to a warm cutting board and rest for 4 minutes. In the same pan juices, toss broccoli florets with lemon juice and zest; sauté for 3 minutes until crisp-tender.", time_minutes=4, safety_tip="Resting redistributes internal juices, ensuring maximum moisture.")
            ],
            nutrition_per_serving=NutrientInfo(
                calories=390.0,
                protein_g=41.0,
                carbs_g=9.5,
                fat_g=19.0,
                fiber_g=3.8,
                sugar_g=2.1,
                sodium_mg=340.0
            ),
            chef_tips=[
                "Deglaze the skillet pan juices with a splash of chicken broth or lemon juice for an instant silky pan sauce.",
                "Zest the lemon before juicing to capture the fragrant aromatic oils in the peel."
            ]
        )

    def chat_with_assistant(self, req: CookingAssistantChatRequest) -> CookingAssistantChatResponse:
        system_instruction = (
            "You are FoodVerse AI Chef, a brilliant, friendly, culinary scientist and kitchen coach. "
            "Help the cook with step-by-step guidance, ingredient substitutions, troubleshooting (e.g. sauce too salty, chicken sticking to pan), "
            "and food safety temperatures. Keep answers concise, encouraging, and actionable."
        )

        user_msg = req.message
        if req.current_recipe:
            user_msg = f"[Context Recipe: {req.current_recipe}] " + user_msg

        # Check for direct substitution requests
        subs_found = []
        msg_lower = user_msg.lower()
        for key, alternatives in SUBSTITUTION_DATABASE.items():
            if key in msg_lower:
                for alt in alternatives:
                    subs_found.append({"ingredient": key.title(), "substitute": alt["substitute"], "purpose": alt["best_for"]})

        if ai_service.has_gemini_key():
            ai_text = ai_service.call_gemini_chat(system_instruction, user_msg)
            if ai_text:
                return CookingAssistantChatResponse(
                    reply=ai_text,
                    suggested_substitutions=subs_found if subs_found else None,
                    quick_tips=["Ensure your pan is hot before adding proteins", "Season in layers rather than only at the end"]
                )

        # Domain fallback conversational response
        default_reply = (
            f"Chef FoodVerse here! Regarding '{req.message}': For optimal flavor and texture, make sure you taste as you cook. "
            "If your dish feels slightly flat, a dash of acidity (fresh lemon juice or sherry vinegar) brightens flavors instantly! "
            "Keep safe cooking temperatures in mind: Poultry to 165°F (74°C), ground beef to 160°F (71°C), and seafood to 145°F (63°C)."
        )
        if subs_found:
            default_reply = f"Here are the best chef-tested culinary substitutions for {subs_found[0]['ingredient']}: " + subs_found[0]['substitute'] + f" ({subs_found[0]['purpose']})."

        return CookingAssistantChatResponse(
            reply=default_reply,
            suggested_substitutions=subs_found if subs_found else None,
            quick_tips=[
                "Never crowd the pan: steaming prevents caramelization and Maillard browning.",
                "Salt early in the cooking process to allow osmotic seasoning to penetrate cells."
            ]
        )

    def generate_meal_plan(self, req: MealPlanRequest) -> MealPlanResponse:
        days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][:req.days_count]
        
        sample_meals = [
            ("Overnight Chia & Berry Oats with Almond Butter", "Grilled Salmon & Quinoa Superfood Bowl", "Lemon Herb Roast Chicken & Sweet Potato", "Handful of Raw Walnuts & Green Apple"),
            ("Greek Yogurt Parfait with Flaxseeds & Honey", "Mediterranean Chickpea & Avocado Wrap", "Grass-Fed Beef Stir-Fry with Bok Choy", "Celery Sticks with Creamy Hummus"),
            ("Poached Eggs on Sourdough with Sliced Avocado", "Lentil & Kale Soup with Turmeric Infusion", "Pan-Seared Cod with Asparagus & Garlic Mash", "Roasted Edamame & Pumpkin Seeds"),
            ("Spinach, Banana & Whey Protein Smoothie Bowl", "Smoked Turkey & Cranberry Spinach Salad", "Baked Herb Tofu with Wild Rice & Broccoli", "Dark Chocolate (85%) & Mixed Berries"),
            ("Avocado & Scrambled Egg Taco on Corn Tortilla", "Tuna Niçoise Salad with Olive Oil Vinaigrette", "Rosemary Lamb Chops with Roasted Cauliflower", "Cottage Cheese with Sliced Peaches"),
            ("Almond Flour Pancakes with Pure Maple Glaze", "Rainbow Veggie Bowl with Tahini Drizzle", "Spiced Moroccan Chicken Tagine with Couscous", "Crispy Air-Fried Chickpeas"),
            ("Classic Shakshuka with Poached Farm Eggs", "Grilled Herb Chicken Breast & Caesar Salad", "Pan-Roasted Halibut with Zucchini Noodles", "Matcha Latte & Handful of Almonds")
        ]

        target_cal = req.calorie_target
        daily_plans = []
        for i, day in enumerate(days):
            meals = sample_meals[i % len(sample_meals)]
            daily_plans.append(DailyMealPlan(
                day=day,
                breakfast=meals[0],
                lunch=meals[1],
                dinner=meals[2],
                snacks=meals[3],
                total_calories=target_cal,
                protein_g=int(target_cal * 0.25 / 4),  # 25% protein
                carbs_g=int(target_cal * 0.45 / 4),    # 45% carbs
                fat_g=int(target_cal * 0.30 / 9)       # 30% healthy fats
            ))

        return MealPlanResponse(
            goal=req.goal,
            diet_type=req.diet_type,
            daily_plans=daily_plans,
            weekly_summary=f"Personalized {req.diet_type} plan configured for {req.goal} at {target_cal} kcal/day. Delivers balanced macronutrient splits with low glycemic impact and anti-inflammatory whole foods.",
            shopping_list=[
                "Salmon Fillets & Free-Range Chicken Breast",
                "Quinoa, Rolled Oats & Wild Rice",
                "Avocados, Spinach, Broccoli & Lemons",
                "Greek Yogurt, Farm Fresh Eggs & Almond Butter",
                "Extra Virgin Olive Oil, Chia Seeds & Walnuts"
            ]
        )

cooking_service = CookingService()
