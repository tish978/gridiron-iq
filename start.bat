@echo off
REM Quick start script for Windows
echo Starting Gridiron IQ Backend...
echo Make sure you're in the project root directory (gridiron-iq)
echo Installing dependencies if needed...
pip install -r backend/requirements.txt
echo.
echo Starting server on http://localhost:8000
python -m uvicorn backend.main:app --reload --port 8000
