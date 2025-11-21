"""
FastAPI Main Application
Main entry point for the e-commerce backend API
"""
from fastapi import FastAPI, Query, HTTPException, status, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.models.product import ProductsResponse, ProductDetail, ProductSummary
from app.models.user import UserCreate, UserLogin, TokenResponse, UserResponse
from app.services.flipkart_api import search_products, get_product_by_id
from app.services.auth_service import register_user, login_user, get_user_by_id, verify_token

# Initialize FastAPI app
app = FastAPI(
    title="E-Commerce Product API",
    version="1.0.0",
    description="Real-time product data API for e-commerce frontend using Flipkart Affiliate API",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


@app.get("/", tags=["Utility"])
async def root():
    """Root endpoint - API information"""
    return {
        "message": "E-Commerce Product API",
        "version": "1.0.0",
        "docs": "/api/docs",
        "endpoints": {
            "search": "/api/products?search=query",
            "product": "/api/product/{id}"
        }
    }


@app.get("/health", tags=["Utility"])
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "e-commerce-api"
    }


@app.get(
    "/api/products",
    response_model=ProductsResponse,
    summary="Search products",
    description="Search for products using Flipkart API. Returns real-time product data.",
    tags=["Products"]
)
async def search_products_endpoint(
    search: str = Query(
        ..., 
        min_length=2, 
        max_length=100,
        description="Search query (minimum 2 characters)",
        example="laptop"
    ),
    limit: int = Query(
        10, 
        ge=1, 
        le=30,
        description="Maximum number of results (1-30)",
        example=10
    )
):
    """
    Search for products in real-time
    
    - **search**: Product search query (required, min 2 chars)
    - **limit**: Number of results to return (1-30, default: 10)
    
    Returns a list of products matching the search query
    """
    try:
        products = await search_products(query=search, limit=limit)
        
        return ProductsResponse(
            query=search,
            count=len(products),
            items=products
        )
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )


@app.get(
    "/api/product/{product_id}",
    response_model=ProductDetail,
    summary="Get product details",
    description="Get detailed information about a specific product by ID",
    tags=["Products"]
)
async def get_product_endpoint(
    product_id: str = Query(
        ...,
        description="Flipkart product ID",
        example="MOBEG4XW7XZFTDXF"
    )
):
    """
    Get detailed product information
    
    - **product_id**: Flipkart product ID (required)
    
    Returns detailed product information including description, brand, MRP, etc.
    """
    try:
        product = await get_product_by_id(product_id)
        return product
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )


# Authentication endpoints
async def get_current_user(authorization: str = Header(None)) -> UserResponse:
    """Dependency to get current authenticated user"""
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    try:
        # Extract token from "Bearer <token>"
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication scheme",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id = verify_token(token)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user


@app.post(
    "/api/auth/register",
    response_model=TokenResponse,
    summary="Register new user",
    description="Create a new user account",
    tags=["Authentication"]
)
async def register_endpoint(user_data: UserCreate):
    """
    Register a new user
    
    - **name**: User's full name
    - **email**: User's email address
    - **password**: User's password (minimum 6 characters)
    
    Returns authentication token and user data
    """
    try:
        user, token = register_user(user_data)
        return TokenResponse(token=token, user=user)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )


@app.post(
    "/api/auth/login",
    response_model=TokenResponse,
    summary="Login user",
    description="Authenticate user and get access token",
    tags=["Authentication"]
)
async def login_endpoint(credentials: UserLogin):
    """
    Login with email and password
    
    - **email**: User's email address
    - **password**: User's password
    
    Returns authentication token and user data
    """
    try:
        user, token = login_user(credentials.email, credentials.password)
        return TokenResponse(token=token, user=user)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )


@app.get(
    "/api/auth/me",
    response_model=UserResponse,
    summary="Get current user",
    description="Get current authenticated user information",
    tags=["Authentication"]
)
async def get_current_user_endpoint(current_user: UserResponse = Depends(get_current_user)):
    """
    Get current authenticated user
    
    Requires Bearer token in Authorization header
    """
    return current_user


# Run with: uvicorn app.main:app --reload --host 0.0.0.0 --port 8000


