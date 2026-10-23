import os
import json
import base64
import requests
from typing import Dict, Any, Optional
from app.config import settings

class MultimodalAIService:
    """
    Multimodal AI Service supporting Gemini 1.5/2.0 API with seamless
    intelligent fallback heuristic & domain knowledge engine.
    """
    def __init__(self):
        self.gemini_key = settings.GEMINI_API_KEY

    def has_gemini_key(self) -> bool:
        return bool(self.gemini_key and len(self.gemini_key.strip()) > 10)

    def set_api_key(self, key: str):
        self.gemini_key = key.strip()
        settings.GEMINI_API_KEY = self.gemini_key

    def call_gemini_multimodal(self, prompt: str, image_bytes: Optional[bytes] = None, mime_type: str = "image/jpeg") -> Optional[str]:
        if not self.has_gemini_key():
            return None
        
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.gemini_key}"
            
            parts = [{"text": prompt}]
            if image_bytes:
                b64_data = base64.b64encode(image_bytes).decode('utf-8')
                parts.append({
                    "inline_data": {
                        "mime_type": mime_type,
                        "data": b64_data
                    }
                })

            payload = {
                "contents": [
                    {
                        "parts": parts
                    }
                ],
                "generationConfig": {
                    "temperature": 0.2,
                    "maxOutputTokens": 2048,
                    "responseMimeType": "application/json"
                }
            }

            resp = requests.post(url, json=payload, timeout=20)
            if resp.status_code == 200:
                result = resp.json()
                text = result["candidates"][0]["content"]["parts"][0]["text"]
                return text
        except Exception as e:
            print(f"[AI Service] Gemini API call exception: {e}")
            return None

    def call_gemini_chat(self, system_instruction: str, message: str) -> Optional[str]:
        if not self.has_gemini_key():
            return None
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.gemini_key}"
            payload = {
                "system_instruction": {
                    "parts": [{"text": system_instruction}]
                },
                "contents": [
                    {"parts": [{"text": message}]}
                ],
                "generationConfig": {
                    "temperature": 0.4,
                    "maxOutputTokens": 1024
                }
            }
            resp = requests.post(url, json=payload, timeout=15)
            if resp.status_code == 200:
                result = resp.json()
                return result["candidates"][0]["content"]["parts"][0]["text"]
        except Exception as e:
            print(f"[AI Service] Gemini Chat call exception: {e}")
            return None

ai_service = MultimodalAIService()
