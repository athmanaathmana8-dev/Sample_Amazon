/**
 * AddProduct Component
 * Form to add new products to the store
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddProduct.css';

function AddProduct({ onProductAdded }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (!formData.name.trim()) {
      setError('Product name is required');
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Valid price is required');
      return;
    }

    if (!formData.image.trim()) {
      setError('Image URL is required');
      return;
    }

    // Get existing products from localStorage or use default
    const existingProducts = JSON.parse(localStorage.getItem('customProducts') || '[]');
    
    // Create new product
    const newProduct = {
      id: Date.now(), // Simple ID generation
      name: formData.name.trim(),
      price: parseFloat(formData.price),
      description: formData.description.trim() || 'No description available.',
      image: formData.image.trim()
    };

    // Add to localStorage
    existingProducts.push(newProduct);
    localStorage.setItem('customProducts', JSON.stringify(existingProducts));

    // Notify parent component
    if (onProductAdded) {
      onProductAdded(newProduct);
    }

    setSuccess(true);
    
    // Reset form
    setFormData({
      name: '',
      price: '',
      description: '',
      image: ''
    });

    // Show success message and redirect after 2 seconds
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  return (
    <div className="add-product-container">
      <button onClick={() => navigate('/')} className="back-button">
        ← Back to Products
      </button>

      <div className="add-product-box">
        <div className="add-product-header">
          <h1 className="add-product-logo">amazon</h1>
          <h2>Add New Product</h2>
        </div>

        <form onSubmit={handleSubmit} className="add-product-form">
          <div className="form-group">
            <label htmlFor="name">Product Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter product name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price ($) *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0.01"
              step="0.01"
              placeholder="Enter price (e.g., 29.99)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Image URL *</label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
              placeholder="https://example.com/image.jpg"
            />
            <small className="form-hint">
              Enter a valid image URL (e.g., from Unsplash or other image hosting)
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Enter product description (optional)"
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && (
            <div className="success-message">
              ✓ Product added successfully! Redirecting to products...
            </div>
          )}

          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-button"
              disabled={success}
            >
              {success ? 'Product Added!' : 'Add Product'}
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate('/')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;

