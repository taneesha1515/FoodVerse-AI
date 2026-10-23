from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.config import settings
from app.database import init_db
from app.services.ai_service import ai_service
from app.api import nutrition, freshness, hygiene, cooking, meal_planner, history

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    print(f"[FoodVerse AI] Initialized database at {settings.DATABASE_PATH}")
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Multimodal AI-Powered Food Intelligence Platform (Computer Vision, Freshness Detection, Hygiene Auditing, Smart Cooking, Nutrition Planning)",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(nutrition.router, prefix=settings.API_PREFIX)
app.include_router(freshness.router, prefix=settings.API_PREFIX)
app.include_router(hygiene.router, prefix=settings.API_PREFIX)
app.include_router(cooking.router, prefix=settings.API_PREFIX)
app.include_router(meal_planner.router, prefix=settings.API_PREFIX)
app.include_router(history.router, prefix=settings.API_PREFIX)

class SetKeyRequest(BaseModel):
    gemini_api_key: str

@app.get("/")
def read_root():
    return {
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "gemini_active": ai_service.has_gemini_key(),
        "docs_url": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "gemini_configured": ai_service.has_gemini_key(),
        "database": "connected"
    }

@app.post("/api/config/set-key")
def update_api_key(req: SetKeyRequest):
    ai_service.set_api_key(req.gemini_api_key)
    return {
        "status": "success",
        "gemini_active": ai_service.has_gemini_key()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
