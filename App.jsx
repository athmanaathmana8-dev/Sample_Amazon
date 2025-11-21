/**
 * Main App Component
 * This component manages the cart state and renders the ProductList and Cart components
 */
import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import AddProduct from './components/AddProduct';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Login from './components/Login';
import './styles.css';

function App() {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const navigate = useNavigate();
  // State to manage the shopping cart
  // cart is an array of objects with product id and quantity
  const [cart, setCart] = useState([]);
  
  // State to manage checkout modal visibility
  const [showCheckout, setShowCheckout] = useState(false);
  // State to trigger product list refresh
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  /**
   * Function to add a product to the cart
   * @param {string|number} productId - The ID of the product to add
   */
  const addToCart = (productId) => {
    // Check if the product is already in the cart
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
      // If product exists, increase its quantity
      setCart(cart.map(item =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      // If product doesn't exist, add it with quantity 1
      setCart([...cart, { id: productId, quantity: 1 }]);
    }
  };

  /**
   * Function to remove a product from the cart
   * @param {number} productId - The ID of the product to remove
   */
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  /**
   * Function to update the quantity of a product in the cart
   * @param {number} productId - The ID of the product
   * @param {number} quantity - The new quantity
   */
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      // If quantity is 0 or less, remove the item
      removeFromCart(productId);
    } else {
      // Update the quantity
      setCart(cart.map(item =>
        item.id === productId
          ? { ...item, quantity: quantity }
          : item
      ));
    }
  };

  /**
   * Function to handle checkout completion
   * Clears the cart and closes checkout modal
   */
  const handleCheckoutComplete = () => {
    setCart([]);
    setShowCheckout(false);
  };

  // Calculate total items in cart
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProductAdded = () => {
    // Trigger refresh of product list
    setRefreshTrigger(prev => prev + 1);
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="app">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '1.2rem',
          color: '#131921'
        }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <Login />
        } 
      />
      <Route
        path="/add-product"
        element={
          !isAuthenticated ? (
            <Navigate to="/login" replace />
          ) : (
            <div className="app">
              <header className="amazon-header">
                <div className="header-top">
                  <div className="header-container">
                    <div className="logo-section">
                      <span className="logo-text" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                        amazon
                      </span>
                    </div>
                    <div className="header-actions">
                      <button
                        onClick={() => navigate('/add-product')}
                        style={{
                          background: 'transparent',
                          border: '1px solid white',
                          color: 'white',
                          padding: '0.5rem 1rem',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          marginRight: '0.5rem'
                        }}
                      >
                        + Add Product
                      </button>
                      <div className="user-info" style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '1rem',
                        marginRight: '1rem',
                        color: 'white',
                        fontSize: '0.875rem'
                      }}>
                        <span>Hello, {user?.name || 'User'}</span>
                        <button
                          onClick={handleLogout}
                          style={{
                            background: 'transparent',
                            border: '1px solid white',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.875rem'
                          }}
                        >
                          Sign Out
                        </button>
                      </div>
                      <div className="cart-icon-container" onClick={() => setShowCheckout(true)}>
                        <span className="cart-icon">🛒</span>
                        <span className="cart-count">{cartItemCount}</span>
                        <span className="cart-text">Cart</span>
                      </div>
                    </div>
                  </div>
                </div>
              </header>
              <AddProduct onProductAdded={handleProductAdded} />
              {showCheckout && (
                <Checkout
                  cart={cart}
                  onClose={() => setShowCheckout(false)}
                  onComplete={handleCheckoutComplete}
                />
              )}
            </div>
          )
        }
      />
      <Route
        path="/product/:id"
        element={
          !isAuthenticated ? (
            <Navigate to="/login" replace />
          ) : (
            <div className="app">
              <header className="amazon-header">
                <div className="header-top">
                  <div className="header-container">
                    <div className="logo-section">
                      <span className="logo-text" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                        amazon
                      </span>
                    </div>
                    <div className="header-actions">
                      <button
                        onClick={() => navigate('/add-product')}
                        style={{
                          background: 'transparent',
                          border: '1px solid white',
                          color: 'white',
                          padding: '0.5rem 1rem',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          marginRight: '0.5rem'
                        }}
                      >
                        + Add Product
                      </button>
                      <div className="user-info" style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '1rem',
                        marginRight: '1rem',
                        color: 'white',
                        fontSize: '0.875rem'
                      }}>
                        <span>Hello, {user?.name || 'User'}</span>
                        <button
                          onClick={handleLogout}
                          style={{
                            background: 'transparent',
                            border: '1px solid white',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.875rem'
                          }}
                        >
                          Sign Out
                        </button>
                      </div>
                      <div className="cart-icon-container" onClick={() => setShowCheckout(true)}>
                        <span className="cart-icon">🛒</span>
                        <span className="cart-count">{cartItemCount}</span>
                        <span className="cart-text">Cart</span>
                      </div>
                    </div>
                  </div>
                </div>
              </header>
              <ProductDetail addToCart={addToCart} />
              {showCheckout && (
                <Checkout
                  cart={cart}
                  onClose={() => setShowCheckout(false)}
                  onComplete={handleCheckoutComplete}
                />
              )}
            </div>
          )
        }
      />
      <Route
        path="/"
        element={
          !isAuthenticated ? (
            <Navigate to="/login" replace />
          ) : (
            <div className="app">
              {/* Amazon-style Header */}
              <header className="amazon-header">
                <div className="header-top">
                  <div className="header-container">
                    <div className="logo-section">
                      <span className="logo-text" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                        amazon
                      </span>
                    </div>
                    <div className="header-actions">
                      <button
                        onClick={() => navigate('/add-product')}
                        style={{
                          background: 'transparent',
                          border: '1px solid white',
                          color: 'white',
                          padding: '0.5rem 1rem',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          marginRight: '0.5rem'
                        }}
                      >
                        + Add Product
                      </button>
                      <div className="user-info" style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '1rem',
                        marginRight: '1rem',
                        color: 'white',
                        fontSize: '0.875rem'
                      }}>
                        <span>Hello, {user?.name || 'User'}</span>
                        <button
                          onClick={handleLogout}
                          style={{
                            background: 'transparent',
                            border: '1px solid white',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.875rem'
                          }}
                        >
                          Sign Out
                        </button>
                      </div>
                      <div className="cart-icon-container" onClick={() => setShowCheckout(true)}>
                        <span className="cart-icon">🛒</span>
                        <span className="cart-count">{cartItemCount}</span>
                        <span className="cart-text">Cart</span>
                      </div>
                    </div>
                  </div>
                </div>
              </header>
              
              <div className="app-container">
                {/* Product List Section */}
                <main className="main-content">
                  <ProductList addToCart={addToCart} cartCount={cartItemCount} refreshTrigger={refreshTrigger} />
                </main>

                {/* Shopping Cart Section - Now as a sidebar */}
                {cart.length > 0 && (
                  <aside className="cart-sidebar">
                    <Cart 
                      cart={cart}
                      removeFromCart={removeFromCart}
                      updateQuantity={updateQuantity}
                      onCheckout={() => setShowCheckout(true)}
                    />
                  </aside>
                )}
              </div>

              {/* Footer */}
              <footer className="amazon-footer">
                <div className="footer-content">
                  <p>&copy; 2024 Amazon-style E-Commerce. All rights reserved.</p>
                </div>
              </footer>

              {/* Checkout Modal */}
              {showCheckout && (
                <Checkout
                  cart={cart}
                  onClose={() => setShowCheckout(false)}
                  onComplete={handleCheckoutComplete}
                />
              )}
            </div>
          )
        }
      />
    </Routes>
  );
}

export default App;

