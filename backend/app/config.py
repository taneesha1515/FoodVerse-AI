import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env if present
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
UPLOAD_DIR = DATA_DIR / "uploads"

DATA_DIR.mkdir(parents=True, exist_ok=True)
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

class Settings:
    PROJECT_NAME: str = "FoodVerse AI"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    DATABASE_PATH: Path = DATA_DIR / "foodverse.db"
    UPLOAD_PATH: Path = UPLOAD_DIR
    
    # API Keys (Supports Gemini & OpenAI or intelligent multimodal simulation)
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # CORS
    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "*"
    ]

settings = Settings()
