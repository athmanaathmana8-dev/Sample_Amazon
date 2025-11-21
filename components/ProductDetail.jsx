/**
 * ProductDetail Component
 * Displays detailed product information and reviews
 */
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../products';
import { getProductReviews, getAverageRating } from '../data/productReviews';
import './ProductDetail.css';

function ProductDetail({ addToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const productId = parseInt(id);
  
  // Load all products including custom ones
  const customProducts = JSON.parse(localStorage.getItem('customProducts') || '[]');
  const allProducts = [...products, ...customProducts];
  
  const product = allProducts.find(p => p.id === productId);
  const reviews = getProductReviews(productId);
  const averageRating = getAverageRating(productId);

  if (!product) {
    return (
      <div className="product-detail-container">
        <div className="product-not-found">
          <h2>Product Not Found</h2>
          <button onClick={() => navigate('/')} className="back-button">
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product.id);
    // Optional: Show a notification or navigate
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'star filled' : 'star'}>
        ★
      </span>
    ));
  };

  return (
    <div className="product-detail-container">
      <button onClick={() => navigate('/')} className="back-button">
        ← Back to Products
      </button>

      <div className="product-detail-content">
        {/* Product Image and Info */}
        <div className="product-detail-main">
          <div className="product-image-section">
            <img 
              src={product.image} 
              alt={product.name}
              className="product-detail-image"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/500x500?text=No+Image';
              }}
            />
          </div>

          <div className="product-info-section">
            <h1 className="product-detail-name">{product.name}</h1>
            
            {reviews.length > 0 && (
              <div className="product-rating-summary">
                <div className="rating-stars">
                  {renderStars(Math.round(parseFloat(averageRating)))}
                </div>
                <span className="rating-text">
                  {averageRating} ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            )}

            <div className="product-price-section">
              <span className="product-detail-price">${product.price.toFixed(2)}</span>
            </div>

            {product.description && (
              <div className="product-description">
                <h3>About this product</h3>
                <p>{product.description}</p>
              </div>
            )}

            <div className="product-actions">
              <button 
                className="add-to-cart-detail-btn"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviews-section">
          <h2 className="reviews-heading">
            Customer Reviews
            {reviews.length > 0 && (
              <span className="reviews-count">({reviews.length})</span>
            )}
          </h2>

          {reviews.length === 0 ? (
            <div className="no-reviews">
              <p>No reviews yet. Be the first to review this product!</p>
            </div>
          ) : (
            <div className="reviews-list">
              {reviews.map(review => (
                <div key={review.id} className="review-item">
                  <div className="review-header">
                    <div className="review-user-info">
                      <span className="review-user-name">{review.userName}</span>
                      <div className="review-rating">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <span className="review-date">{review.date}</span>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;

