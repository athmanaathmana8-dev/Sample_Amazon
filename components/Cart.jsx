/**
 * Cart Component
 * Displays all items in the shopping cart and calculates the total price
 */
import React from 'react';
import { products } from '../products';

function Cart({ cart, removeFromCart, updateQuantity, onCheckout }) {
  /**
   * Get all products including custom ones
   * @returns {Array} - All products
   */
  const getAllProducts = () => {
    const customProducts = JSON.parse(localStorage.getItem('customProducts') || '[]');
    return [...products, ...customProducts];
  };

  /**
   * Calculate the total price of all items in the cart
   * @returns {number} - The total price
   */
  const calculateTotal = () => {
    const allProducts = getAllProducts();
    return cart.reduce((total, cartItem) => {
      // Find the product details using the cart item's id
      const product = allProducts.find(p => p.id === cartItem.id);
      // Add (price * quantity) to the total
      return total + (product ? product.price * cartItem.quantity : 0);
    }, 0);
  };

  /**
   * Get product details by ID
   * @param {number} productId - The ID of the product
   * @returns {object} - The product object
   */
  const getProduct = (productId) => {
    const allProducts = getAllProducts();
    return allProducts.find(p => p.id === productId);
  };

  return (
    <div className="cart">
      <h2>Shopping Cart</h2>
      
      {/* Display cart items or empty message */}
      {cart.length === 0 ? (
        <div className="cart-empty">
          <p>Your cart is empty</p>
          <p className="cart-empty-hint">Add some products to get started!</p>
        </div>
      ) : (
        <>
          {/* List of cart items */}
          <div className="cart-items">
            {cart.map(cartItem => {
              const product = getProduct(cartItem.id);
              
              if (!product) return null;
              
              return (
                <div key={cartItem.id} className="cart-item">
                  <div className="cart-item-info">
                    <h4 className="cart-item-name">{product.name}</h4>
                    <p className="cart-item-price">
                      ${product.price.toFixed(2)} each
                    </p>
                  </div>
                  
                  {/* Quantity controls */}
                  <div className="cart-item-controls">
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="quantity">{cartItem.quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  
                  {/* Item total */}
                  <div className="cart-item-total">
                    <p>${(product.price * cartItem.quantity).toFixed(2)}</p>
                  </div>
                  
                  {/* Remove button */}
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(cartItem.id)}
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
          
          {/* Total price section */}
          <div className="cart-total">
            <div className="total-line">
              <span className="total-label">Total:</span>
              <span className="total-amount">${calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <button 
            className="checkout-btn"
            onClick={onCheckout}
          >
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;

