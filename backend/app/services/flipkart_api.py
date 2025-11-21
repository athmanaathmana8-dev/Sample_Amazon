"""
Flipkart Affiliate API Service Handler
Handles all API calls to Flipkart's affiliate API with proper error handling
"""
import httpx
from fastapi import HTTPException, status
from typing import Dict, Any, List
from app.config import settings
from app.models.product import ProductDetail, ProductSummary, Price


# API Endpoints
SEARCH_ENDPOINT = "/search.json"
PRODUCT_ENDPOINT = "/product.json"


def _build_headers() -> Dict[str, str]:
    """Build request headers with Flipkart API credentials"""
    return {
        "Fk-Affiliate-Id": settings.flipkart_affiliate_id,
        "Fk-Affiliate-Token": settings.flipkart_affiliate_token,
        "Accept": "application/json",
        "Content-Type": "application/json"
    }


async def _make_request(endpoint: str, params: Dict[str, Any]) -> Dict[str, Any]:
    """
    Make HTTP request to Flipkart API with error handling
    
    Args:
        endpoint: API endpoint path
        params: Query parameters
        
    Returns:
        JSON response data
        
    Raises:
        HTTPException: For API errors, timeouts, or invalid responses
    """
    try:
        async with httpx.AsyncClient(
            base_url=settings.flipkart_base_url,
            headers=_build_headers(),
            timeout=httpx.Timeout(10.0, connect=5.0)
        ) as client:
            response = await client.get(endpoint, params=params)
            
    except httpx.TimeoutException as e:
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail="Flipkart API request timed out. Please try again later."
        ) from e
        
    except httpx.ConnectError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Unable to connect to Flipkart API. Service may be unavailable."
        ) from e
        
    except httpx.HTTPError as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Error communicating with Flipkart API: {str(e)}"
        ) from e
    
    # Handle HTTP error status codes
    if response.status_code == 401:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Flipkart API credentials. Please check your affiliate ID and token."
        )
    elif response.status_code == 403:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden. Check your API permissions."
        )
    elif response.status_code == 404:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product or endpoint not found."
        )
    elif response.status_code >= 500:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Flipkart API server error. Please try again later."
        )
    elif response.status_code >= 400:
        error_detail = "Unknown API error"
        try:
            error_data = response.json()
            error_detail = error_data.get("error", {}).get("message", str(error_data))
        except:
            error_detail = response.text or f"HTTP {response.status_code} error"
        
        raise HTTPException(
            status_code=response.status_code,
            detail=f"API error: {error_detail}"
        )
    
    # Parse JSON response
    try:
        return response.json()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Invalid JSON response from API: {str(e)}"
        )


def _extract_price(data: Dict[str, Any]) -> float:
    """Extract price amount from Flipkart API response"""
    if isinstance(data, dict):
        amount = data.get("amount", 0)
        if isinstance(amount, (int, float)):
            return float(amount)
    return 0.0


def _map_to_product_summary(item: Dict[str, Any]) -> ProductSummary:
    """
    Map Flipkart API response to ProductSummary model
    Compatible with React frontend structure
    """
    base_info = item.get("productBaseInfoV1", {})
    
    # Extract product ID
    product_id = base_info.get("productId", f"product_{hash(str(item))}")
    
    # Extract title/name
    product_name = base_info.get("title", "Unknown Product")
    
    # Extract image URL
    image_urls = base_info.get("imageUrls", {})
    image_url = image_urls.get("400x400") or image_urls.get("200x200") or None
    
    # Extract price
    selling_price = base_info.get("flipkartSellingPrice", {})
    price = _extract_price(selling_price)
    
    # Extract product URL
    product_url = base_info.get("productUrl")
    
    # Extract availability
    availability = base_info.get("availability", {}).get("available", False)
    availability_str = "In Stock" if availability else "Out of Stock"
    
    return ProductSummary(
        id=product_id,
        name=product_name,
        price=price,
        image=image_url,
        product_url=product_url,
        availability=availability_str
    )


def _map_to_product_detail(data: Dict[str, Any]) -> ProductDetail:
    """
    Map Flipkart API response to ProductDetail model
    Compatible with React frontend structure
    """
    base_info = data.get("productBaseInfoV1", {})
    
    # Extract product ID
    product_id = base_info.get("productId", "unknown")
    
    # Extract title/name
    product_name = base_info.get("title", "Unknown Product")
    
    # Extract description
    description = base_info.get("productDescription")
    
    # Extract image URL (prefer higher resolution)
    image_urls = base_info.get("imageUrls", {})
    image_url = (
        image_urls.get("400x400") or 
        image_urls.get("200x200") or 
        None
    )
    
    # Extract selling price
    selling_price = base_info.get("flipkartSellingPrice", {})
    price = _extract_price(selling_price)
    
    # Extract MRP
    mrp_data = base_info.get("maximumRetailPrice", {})
    mrp = _extract_price(mrp_data) if mrp_data else None
    
    # Extract brand
    brand = base_info.get("productBrand")
    
    # Extract product URL
    product_url = base_info.get("productUrl")
    
    # Extract availability
    availability = base_info.get("availability", {}).get("available", False)
    availability_str = "In Stock" if availability else "Out of Stock"
    
    # Extract additional attributes
    attributes = {
        "productType": base_info.get("productType"),
        "category": base_info.get("categoryPath"),
    }
    # Add specific offers if available
    specific_offers = base_info.get("specificOffers", {})
    if specific_offers:
        attributes.update(specific_offers)
    
    # Filter out None values
    attributes = {k: str(v) for k, v in attributes.items() if v is not None}
    
    return ProductDetail(
        id=product_id,
        name=product_name,
        price=price,
        image=image_url,
        description=description,
        brand=brand,
        mrp=mrp,
        product_url=product_url,
        availability=availability_str,
        attributes=attributes if attributes else None
    )


async def search_products(query: str, limit: int = 10) -> List[ProductSummary]:
    """
    Search for products using Flipkart API
    
    Args:
        query: Search query string
        limit: Maximum number of results (1-30)
        
    Returns:
        List of ProductSummary objects
    """
    # Validate limit
    limit = max(1, min(30, limit))
    
    try:
        response_data = await _make_request(
            SEARCH_ENDPOINT,
            params={"query": query, "resultCount": limit}
        )
        
        # Extract product list from response
        product_list = response_data.get("productInfoList", [])
        
        # Map each product to ProductSummary
        products = [
            _map_to_product_summary(item) 
            for item in product_list 
            if item.get("productBaseInfoV1")
        ]
        
        return products
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing product search: {str(e)}"
        )


async def get_product_by_id(product_id: str) -> ProductDetail:
    """
    Get detailed product information by ID
    
    Args:
        product_id: Flipkart product ID
        
    Returns:
        ProductDetail object
    """
    try:
        response_data = await _make_request(
            PRODUCT_ENDPOINT,
            params={"id": product_id}
        )
        
        # Check if product data exists
        if not response_data.get("productBaseInfoV1"):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product with ID '{product_id}' not found"
            )
        
        return _map_to_product_detail(response_data)
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching product details: {str(e)}"
        )


