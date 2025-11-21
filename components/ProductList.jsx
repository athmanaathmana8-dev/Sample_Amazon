/**
 * ProductList Component
 * Displays a list of products with their name, price, and "Add to Cart" button
 * Fetches real-time product data from FastAPI backend
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchProducts } from '../services/api';
import { products as fallbackProducts } from '../products';

function ProductList({ addToCart, refreshTrigger }) {
  const navigate = useNavigate();
  // State for search query
  const [searchQuery, setSearchQuery] = useState('');
  // State for products from API
  const [products, setProducts] = useState([]);
  // State for loading
  const [loading, setLoading] = useState(false);
  // State for error
  const [error, setError] = useState(null);
  // State for API availability
  const [useApi, setUseApi] = useState(true);

  // Load products including custom ones from localStorage
  const loadAllProducts = () => {
    const customProducts = JSON.parse(localStorage.getItem('customProducts') || '[]');
    return [...fallbackProducts, ...customProducts];
  };

  /**
   * Load products from API or use fallback
   */
  useEffect(() => {
    const loadProducts = async () => {
      // If no search query, use fallback products + custom products
      if (!searchQuery.trim()) {
        const allProducts = loadAllProducts();
        setProducts(allProducts);
        setError(null);
        return;
      }

      // Try to fetch from API
      if (useApi) {
        setLoading(true);
        setError(null);
        try {
          const apiProducts = await searchProducts(searchQuery, 20);
          if (apiProducts && apiProducts.length > 0) {
            // Map API products to match frontend structure
            const mappedProducts = apiProducts.map((product, index) => ({
              id: product.id || `api-${index}`,
              name: product.name,
              price: product.price,
              image: product.image || 'https://via.placeholder.com/300x300?text=No+Image'
            }));
            setProducts(mappedProducts);
          } else {
            setProducts([]);
          }
        } catch (err) {
          console.error('API Error:', err);
          setError(err.message);
          // Fallback to local products if API fails
          const allProducts = loadAllProducts();
          const filtered = allProducts.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setProducts(filtered);
        } finally {
          setLoading(false);
        }
      } else {
        // Use local fallback
        const allProducts = loadAllProducts();
        const filtered = allProducts.filter(p =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setProducts(filtered);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(() => {
      loadProducts();
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timeoutId);
  }, [searchQuery, useApi, refreshTrigger]);

  /**
   * Handle the "Add to Cart" button click
   * @param {string|number} productId - The ID of the product to add
   */
  const handleAddToCart = (productId) => {
    addToCart(productId);
  };

  /**
   * Handle search input change
   * @param {Event} e - The input change event
   */
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  /**
   * Clear the search query
   */
  const handleClearSearch = () => {
    setSearchQuery('');
    const allProducts = loadAllProducts();
    setProducts(allProducts);
    setError(null);
  };

  // Use products for display
  const filteredProducts = products;

  return (
    <div className="product-list">
      <div className="product-list-header">
        <h2>Products</h2>
        
        {/* Search Bar */}
        <div className="search-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
            {searchQuery && (
              <button
                className="clear-search-btn"
                onClick={handleClearSearch}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
            <button
              className="search-btn"
              onClick={() => {}} // Search happens automatically on input change
              aria-label="Search"
            >
              🔍
            </button>
          </div>
        </div>
      </div>

      {/* Display search results count */}
      {searchQuery && (
        <div className="search-results-info">
          <p>
            {loading ? (
              'Searching...'
            ) : error ? (
              `Using local products (API unavailable)`
            ) : filteredProducts.length === 0 ? (
              'No products found'
            ) : (
              `Found ${filteredProducts.length} product${filteredProducts.length === 1 ? '' : 's'}`
            )}
          </p>
        </div>
      )}

      {/* Error message */}
      {error && useApi && (
        <div className="api-error-message">
          <p>⚠️ API Error: {error}</p>
          <p>Using local products as fallback</p>
        </div>
      )}
      
      {/* Loading state */}
      {loading && (
        <div className="loading-message">
          <p>Loading products from API...</p>
        </div>
      )}
      
      {/* Display filtered products */}
      {!loading && filteredProducts.length === 0 && searchQuery ? (
        <div className="no-products-message">
          <p>No products match your search "{searchQuery}"</p>
          <button className="clear-search-link" onClick={handleClearSearch}>
            Clear search and show all products
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            {/* Product Image - Clickable */}
            <div 
              className="product-image-container"
              onClick={() => navigate(`/product/${product.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <img 
                src={product.image} 
                alt={product.name}
                className="product-image"
                onError={(e) => {
                  // Fallback if image fails to load
                  e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                }}
              />
            </div>
            
            <div 
              className="product-info"
              onClick={() => navigate(`/product/${product.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">${product.price.toFixed(2)}</p>
            </div>
            
            {/* Add to Cart Button */}
            <button
              className="add-to-cart-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(product.id);
              }}
            >
              Add to Cart
            </button>
          </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;
