@echo off
title FoodVerse AI Platform
echo ==========================================================
echo        Starting FoodVerse AI Multimodal Platform
echo ==========================================================

set ROOT_DIR=%~dp0
set BACKEND_DIR=%ROOT_DIR%backend
set FRONTEND_DIR=%ROOT_DIR%frontend

echo [1/2] Launching FastAPI Backend on port 8000...
start "FoodVerse Backend" cmd /k "set PYTHONPATH=%BACKEND_DIR% && python -m uvicorn app.main:app --app-dir "%BACKEND_DIR%" --host 0.0.0.0 --port 8000 --reload"

timeout /t 2 /nobreak >nul

echo [2/2] Launching React Vite Frontend on port 3000...
start "FoodVerse Frontend" cmd /k "cd /d "%FRONTEND_DIR%" && npm run dev"

echo.
echo FoodVerse AI is running!
echo Frontend: http://localhost:3000
echo Swagger Docs: http://localhost:8000/docs
echo ==========================================================
pause
