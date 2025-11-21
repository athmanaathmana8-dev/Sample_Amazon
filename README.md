# E-Commerce Application

A full-stack e-commerce application with React frontend and FastAPI backend, featuring real-time product data from Flipkart Affiliate API.

## 🚀 Features

- **React Frontend**: Modern, Amazon-style UI with shopping cart
- **FastAPI Backend**: Real-time product data from Flipkart API
- **Product Search**: Real-time search with API integration
- **Shopping Cart**: Add, remove, and manage cart items
- **Checkout**: Payment processing with validation
- **Responsive Design**: Works on desktop and mobile

## 📁 Project Structure

```
e-commerse/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── main.py         # FastAPI application
│   │   ├── config.py       # Configuration
│   │   ├── models/         # Pydantic models
│   │   └── services/       # API services
│   ├── requirements.txt    # Python dependencies
│   └── README.md          # Backend documentation
├── components/             # React components
│   ├── ProductList.jsx
│   ├── Cart.jsx
│   └── Checkout.jsx
├── services/               # Frontend API service
│   └── api.js
├── App.jsx                # Main React app
├── products.js            # Fallback product data
└── styles.css             # Amazon-style CSS
```

## 🛠️ Setup Instructions

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment variables:**
   ```bash
   # Copy the example file
   cp env.example .env
   
   # Edit .env and add your Flipkart API credentials
   # Get credentials from: https://affiliate.flipkart.com/
   ```

4. **Run the FastAPI server:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

   The API will be available at: `http://localhost:8000`
   - API Docs: http://localhost:8000/api/docs

### Frontend Setup

1. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

   The app will be available at: `http://localhost:5173`

## 🔌 API Integration

The frontend automatically uses the FastAPI backend when available. If the API is unavailable, it falls back to local product data.

### API Endpoints

- **Search Products**: `GET /api/products?search=query&limit=10`
- **Product Details**: `GET /api/product/{id}`
- **Health Check**: `GET /health`

### Environment Variables

Create a `.env` file in the root (optional):
```
VITE_API_URL=http://localhost:8000
```

## 📝 Usage

1. **Start Backend**: Run the FastAPI server (see Backend Setup)
2. **Start Frontend**: Run `npm run dev`
3. **Search Products**: Type in the search bar to fetch real-time products
4. **Add to Cart**: Click "Add to Cart" on any product
5. **Checkout**: Click "Proceed to Checkout" to complete purchase

## 🔐 Flipkart API Setup

1. Visit https://affiliate.flipkart.com/
2. Sign up for an affiliate account
3. Get your Affiliate ID and Token
4. Add them to `backend/.env`

## 🎨 Features

- ✅ Amazon-style UI design
- ✅ Real-time product search
- ✅ Shopping cart functionality
- ✅ Payment method selection
- ✅ Form validation
- ✅ Responsive design
- ✅ Error handling
- ✅ API fallback mechanism

## 🐛 Troubleshooting

**Backend not connecting:**
- Check if backend is running on port 8000
- Verify `.env` file has correct API credentials
- Check CORS settings in `backend/app/config.py`

**Products not loading:**
- Verify Flipkart API credentials
- Check browser console for errors
- Frontend will fallback to local products if API fails

**CORS errors:**
- Add your frontend URL to `CORS_ALLOWED_ORIGINS` in backend `.env`
- Restart backend server after changes

## 📚 Documentation

- **Backend API Docs**: http://localhost:8000/api/docs (when backend is running)
- **Backend README**: See `backend/README.md`

## 🚀 Production Deployment

1. Set up environment variables for production
2. Build React app: `npm run build`
3. Run FastAPI with production server (Gunicorn + Uvicorn)
4. Configure CORS for production domain
5. Set up reverse proxy (Nginx)

## 📄 License

This project is for educational purposes.
