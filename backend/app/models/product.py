"""
Pydantic models for product data structures
Defines response schemas for API endpoints
"""
from typing import List, Optional, Dict
from pydantic import BaseModel, HttpUrl


class Price(BaseModel):
    """Price information model"""
    amount: float
    currency: str = "INR"


class ProductSummary(BaseModel):
    """Product summary for list/search responses"""
    id: str
    name: str  # Changed from 'title' to match frontend
    price: float  # Simplified to match frontend
    image: Optional[str] = None
    product_url: Optional[str] = None
    availability: Optional[str] = None


class ProductsResponse(BaseModel):
    """Response model for product search endpoint"""
    query: str
    count: int
    items: List[ProductSummary]


class ProductDetail(BaseModel):
    """Detailed product information model"""
    id: str
    name: str
    price: float
    image: Optional[str] = None
    description: Optional[str] = None
    brand: Optional[str] = None
    mrp: Optional[float] = None
    product_url: Optional[str] = None
    availability: Optional[str] = None
    attributes: Optional[Dict[str, str]] = None


