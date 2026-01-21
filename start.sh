#!/bin/bash
# Quick start script for Linux/Mac
echo "Starting Gridiron IQ Backend..."
echo "Make sure you're in the project root directory (gridiron-iq)"
echo "Installing dependencies if needed..."
pip3 install -r backend/requirements.txt
echo ""
echo "Starting server on http://localhost:8000"
python3 -m uvicorn backend.main:app --reload --port 8000
