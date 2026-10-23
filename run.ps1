# FoodVerse AI Launcher (Windows PowerShell)
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "       Starting FoodVerse AI Multimodal Platform          " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Green

$rootDir = $PSScriptRoot
$backendDir = Join-Path $rootDir "backend"
$frontendDir = Join-Path $rootDir "frontend"

# Start Backend
Write-Host "[1/2] Launching FastAPI Backend on http://localhost:8000..." -ForegroundColor Yellow
$backendProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$env:PYTHONPATH='$backendDir'; cd '$rootDir'; python -m uvicorn app.main:app --app-dir '$backendDir' --host 0.0.0.0 --port 8000 --reload" -PassThru

Start-Sleep -Seconds 2

# Start Frontend
Write-Host "[2/2] Launching React Vite Frontend on http://localhost:3000..." -ForegroundColor Yellow
$frontendProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendDir'; npm run dev" -PassThru

Write-Host ""
Write-Host "FoodVerse AI is running!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend API: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Green
