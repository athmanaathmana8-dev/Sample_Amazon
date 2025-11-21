#!/bin/bash
echo "Starting FastAPI Backend Server..."
echo ""
echo "Make sure you have:"
echo "1. Created .env file with your Flipkart API credentials"
echo "2. Installed dependencies: pip install -r requirements.txt"
echo ""
read -p "Press enter to continue..."
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000





