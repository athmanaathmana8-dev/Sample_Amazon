# FastAPI Backend - E-Commerce Product API

Real-time product data API using Flipkart Affiliate API, integrated with React frontend.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your Flipkart API credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```
FLIPKART_AFFILIATE_ID=your_affiliate_id_here
FLIPKART_AFFILIATE_TOKEN=your_affiliate_token_here
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 3. Get Flipkart API Credentials

1. Visit: https://affiliate.flipkart.com/
2. Sign up for an affiliate account
3. Get your Affiliate ID and Token from the dashboard
4. Add them to your `.env` file

### 4. Run the Server

**Development mode (with auto-reload):**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Production mode:**
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

The API will be available at: `http://localhost:8000`

## 📚 API Endpoints

### Health Check
```
GET /health
```

### Search Products
```
GET /api/products?search=laptop&limit=10
```

**Response:**
```json
{
  "query": "laptop",
  "count": 10,
  "items": [
    {
      "id": "MOBEG4XW7XZFTDXF",
      "name": "HP Laptop 15s",
      "price": 34999.0,
      "image": "https://...",
      "availability": "In Stock"
    }
  ]
}
```

### Get Product Details
```
GET /api/product/{product_id}
```

**Response:**
```json
{
  "id": "MOBEG4XW7XZFTDXF",
  "name": "HP Laptop 15s",
  "price": 34999.0,
  "mrp": 45000.0,
  "description": "Product description...",
  "brand": "HP",
  "image": "https://...",
  "availability": "In Stock"
}
```

## 🔧 API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc

## 🛠️ Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration settings
│   ├── models/
│   │   ├── __init__.py
│   │   └── product.py       # Pydantic models
│   └── services/
│       ├── __init__.py
│       └── flipkart_api.py  # API service handler
├── .env                     # Environment variables (create from .env.example)
├── .env.example            # Example environment file
├── requirements.txt        # Python dependencies
└── README.md               # This file
```

## 🔐 Error Handling

The API includes comprehensive error handling for:
- **Timeouts**: 504 Gateway Timeout
- **Connection Errors**: 503 Service Unavailable
- **Authentication Errors**: 401 Unauthorized
- **Not Found**: 404 Not Found
- **Server Errors**: 502 Bad Gateway
- **Invalid Responses**: 500 Internal Server Error

## 🌐 CORS Configuration

CORS is configured to allow requests from your React frontend. Update `CORS_ALLOWED_ORIGINS` in `.env` to add more origins.

## 📝 Notes

- API rate limits apply based on your Flipkart affiliate account
- All prices are in INR (Indian Rupees)
- Product availability is real-time from Flipkart
- Images are served directly from Flipkart CDN

## 🐛 Troubleshooting

**Issue: "Invalid API credentials"**
- Check your `.env` file has correct `FLIPKART_AFFILIATE_ID` and `FLIPKART_AFFILIATE_TOKEN`
- Verify credentials in Flipkart affiliate dashboard

**Issue: "CORS error"**
- Add your frontend URL to `CORS_ALLOWED_ORIGINS` in `.env`
- Restart the server after changing `.env`

**Issue: "Connection timeout"**
- Check your internet connection
- Verify Flipkart API is accessible
- Increase timeout in `flipkart_api.py` if needed





