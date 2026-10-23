import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["project"] == "FoodVerse AI"
    assert data["status"] == "online"

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_nutrition_samples():
    response = client.get("/api/nutrition/samples")
    assert response.status_code == 200
    samples = response.json()
    assert len(samples) > 0
    assert any(s["id"] == "avocado_toast" for s in samples)

def test_nutrition_analyze_sample():
    response = client.post("/api/nutrition/analyze", data={"sample_id": "avocado_toast"})
    assert response.status_code == 200
    data = response.json()
    assert "dish_name" in data
    assert data["total_nutrients"]["calories"] > 0
    assert "health_score" in data

def test_freshness_samples():
    response = client.get("/api/freshness/samples")
    assert response.status_code == 200
    samples = response.json()
    assert len(samples) > 0

def test_freshness_inspect():
    response = client.post("/api/freshness/inspect", data={"sample_id": "fresh_strawberries"})
    assert response.status_code == 200
    data = response.json()
    assert data["freshness_score"] >= 90
    assert "status" in data

def test_hygiene_samples():
    response = client.get("/api/hygiene/samples")
    assert response.status_code == 200
    samples = response.json()
    assert len(samples) > 0

def test_hygiene_audit():
    response = client.post("/api/hygiene/audit", data={"sample_id": "compliant_station"})
    assert response.status_code == 200
    data = response.json()
    assert data["hygiene_score"] >= 90
    assert "grade" in data

def test_cooking_recipe():
    response = client.post("/api/cooking/recipe", json={"ingredients": ["salmon", "quinoa", "asparagus"]})
    assert response.status_code == 200
    data = response.json()
    assert "recipe_name" in data
    assert len(data["instructions"]) > 0

def test_cooking_chat_substitution():
    response = client.post("/api/cooking/chat", json={"message": "Can I replace egg in this recipe?"})
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data

def test_meal_plan_generator():
    response = client.post("/api/meal-planner/generate", json={"calorie_target": 2200, "goal": "Muscle Gain", "days_count": 5})
    assert response.status_code == 200
    data = response.json()
    assert len(data["daily_plans"]) == 5
