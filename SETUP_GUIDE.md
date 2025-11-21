# 🚀 Quick Setup Guide - Full Stack E-Commerce

This guide will help you set up both the React frontend and FastAPI backend.

## 📋 Prerequisites

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download](https://www.python.org/)
- **pip** (Python package manager)

## 🔧 Step-by-Step Setup

### 1. Backend Setup (FastAPI)

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Create .env file from example
# Windows:
copy env.example .env
# Linux/Mac:
cp env.example .env

# Edit .env file and add your Flipkart API credentials
# Get credentials from: https://affiliate.flipkart.com/
```

**Edit `.env` file:**
```
FLIPKART_AFFILIATE_ID=your_affiliate_id_here
FLIPKART_AFFILIATE_TOKEN=your_affiliate_token_here
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

**Start the backend:**
```bash
# Option 1: Use the startup script
# Windows:
start.bat
# Linux/Mac:
chmod +x start.sh
./start.sh

# Option 2: Manual start
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

✅ Backend should be running at: `http://localhost:8000`
- API Docs: http://localhost:8000/api/docs

### 2. Frontend Setup (React)

```bash
# Navigate back to root directory
cd ..

# Install Node.js dependencies (if not already done)
npm install

# Start the development server
npm run dev
```

✅ Frontend should be running at: `http://localhost:5173`

## 🎯 How It Works

1. **Without API**: Frontend uses local product data from `products.js`
2. **With API**: When you search, frontend fetches real-time products from Flipkart API via FastAPI backend
3. **Fallback**: If API fails, frontend automatically falls back to local products

## 🔍 Testing the Integration

1. **Start both servers** (backend on port 8000, frontend on port 5173)
2. **Open frontend**: http://localhost:5173
3. **Search for products**: Type "laptop" or "phone" in the search bar
4. **Check browser console**: Should see API calls to backend
5. **Check backend logs**: Should see API requests being processed

## 🐛 Troubleshooting

### Backend Issues

**"Module not found" errors:**
```bash
cd backend
pip install -r requirements.txt
```

**"Invalid API credentials" error:**
- Check your `.env` file has correct credentials
- Verify credentials at https://affiliate.flipkart.com/

**"Port 8000 already in use":**
```bash
# Change port in .env or use different port:
uvicorn app.main:app --reload --port 8001
```

### Frontend Issues

**"API Error" messages:**
- Make sure backend is running
- Check backend URL in `services/api.js`
- Verify CORS settings in `backend/app/config.py`

**Products not loading:**
- Check browser console for errors
- Verify backend is accessible: http://localhost:8000/health
- Frontend will use local products as fallback

## 📚 Next Steps

1. **Get Flipkart API Credentials**: Sign up at https://affiliate.flipkart.com/
2. **Test API Endpoints**: Visit http://localhost:8000/api/docs
3. **Customize Products**: Edit `products.js` for local products
4. **Deploy**: Follow deployment guides in README.md

## 🎉 You're All Set!

Your full-stack e-commerce app is ready! The frontend will automatically use the API when available, and fall back to local data if needed.





