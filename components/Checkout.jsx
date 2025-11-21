/**
 * Checkout Component
 * Handles payment method selection and payment form
 */
import React, { useState } from 'react';
import { products } from '../products';

function Checkout({ cart, onClose, onComplete }) {
  // State for payment method selection
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  
  // State for credit card form fields
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  // State for delivery information (Cash on Delivery)
  const [deliveryData, setDeliveryData] = useState({
    name: '',
    contactNumber: '',
    address: ''
  });

  // State for validation errors
  const [errors, setErrors] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    deliveryName: '',
    contactNumber: '',
    address: ''
  });

  /**
   * Calculate the total price of all items in the cart
   * @returns {number} - The total price
   */
  const calculateTotal = () => {
    return cart.reduce((total, cartItem) => {
      const product = products.find(p => p.id === cartItem.id);
      return total + (product ? product.price * cartItem.quantity : 0);
    }, 0);
  };

  /**
   * Get product details by ID
   * @param {number} productId - The ID of the product
   * @returns {object} - The product object
   */
  const getProduct = (productId) => {
    return products.find(p => p.id === productId);
  };

  /**
   * Format card number with spaces (e.g., 1234 5678 9012 3456)
   * @param {string} value - The card number input
   * @returns {string} - Formatted card number
   */
  const formatCardNumber = (value) => {
    // Remove all non-digits
    const numbers = value.replace(/\D/g, '');
    // Add spaces every 4 digits
    return numbers.match(/.{1,4}/g)?.join(' ') || numbers;
  };

  /**
   * Format expiry date as MM/YY
   * @param {string} value - The expiry date input
   * @returns {string} - Formatted expiry date
   */
  const formatExpiryDate = (value) => {
    // Remove all non-digits
    const numbers = value.replace(/\D/g, '');
    if (numbers.length >= 2) {
      return numbers.slice(0, 2) + '/' + numbers.slice(2, 4);
    }
    return numbers;
  };

  /**
   * Validate card number
   * @param {string} cardNumber - The card number to validate
   * @returns {string} - Error message or empty string
   */
  const validateCardNumber = (cardNumber) => {
    const numbers = cardNumber.replace(/\s/g, '');
    if (!numbers) {
      return 'Card number is required';
    }
    if (numbers.length < 16) {
      return 'Card number must be 16 digits';
    }
    if (!/^\d+$/.test(numbers)) {
      return 'Card number must contain only numbers';
    }
    return '';
  };

  /**
   * Validate cardholder name
   * @param {string} name - The cardholder name to validate
   * @returns {string} - Error message or empty string
   */
  const validateCardName = (name) => {
    if (!name.trim()) {
      return 'Cardholder name is required';
    }
    if (name.trim().length < 2) {
      return 'Name must be at least 2 characters';
    }
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      return 'Name can only contain letters and spaces';
    }
    return '';
  };

  /**
   * Validate expiry date
   * @param {string} expiryDate - The expiry date to validate
   * @returns {string} - Error message or empty string
   */
  const validateExpiryDate = (expiryDate) => {
    if (!expiryDate) {
      return 'Expiry date is required';
    }
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      return 'Please enter a valid date (MM/YY)';
    }
    const [month, year] = expiryDate.split('/');
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);
    
    if (monthNum < 1 || monthNum > 12) {
      return 'Month must be between 01 and 12';
    }
    
    // Check if card is expired
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
      return 'Card has expired';
    }
    return '';
  };

  /**
   * Validate CVV
   * @param {string} cvv - The CVV to validate
   * @returns {string} - Error message or empty string
   */
  const validateCVV = (cvv) => {
    if (!cvv) {
      return 'CVV is required';
    }
    if (!/^\d+$/.test(cvv)) {
      return 'CVV must contain only numbers';
    }
    if (cvv.length < 3 || cvv.length > 4) {
      return 'CVV must be 3 or 4 digits';
    }
    return '';
  };

  /**
   * Validate delivery name
   * @param {string} name - The name to validate
   * @returns {string} - Error message or empty string
   */
  const validateDeliveryName = (name) => {
    if (!name.trim()) {
      return 'Name is required';
    }
    if (name.trim().length < 2) {
      return 'Name must be at least 2 characters';
    }
    if (name.trim().length > 50) {
      return 'Name must be 50 characters or less';
    }
    if (!/^[a-zA-Z\s\.\'\-]+$/.test(name)) {
      return 'Name can only contain letters, spaces, hyphens, apostrophes, and periods';
    }
    // Check for multiple consecutive spaces
    if (/\s{2,}/.test(name)) {
      return 'Name cannot contain multiple consecutive spaces';
    }
    // Check if name starts or ends with space
    if (name !== name.trim()) {
      return 'Name cannot start or end with spaces';
    }
    return '';
  };

  /**
   * Format contact number (adds spaces for readability)
   * @param {string} value - The contact number input
   * @returns {string} - Formatted contact number
   */
  const formatContactNumber = (value) => {
    // Remove all non-digits
    const numbers = value.replace(/\D/g, '');
    // Format as XXX XXX XXXX or similar
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 6) {
      return numbers.slice(0, 3) + ' ' + numbers.slice(3);
    } else if (numbers.length <= 10) {
      return numbers.slice(0, 3) + ' ' + numbers.slice(3, 6) + ' ' + numbers.slice(6);
    } else {
      return numbers.slice(0, 3) + ' ' + numbers.slice(3, 6) + ' ' + numbers.slice(6, 10) + ' ' + numbers.slice(10, 15);
    }
  };

  /**
   * Validate contact number
   * @param {string} contactNumber - The contact number to validate
   * @returns {string} - Error message or empty string
   */
  const validateContactNumber = (contactNumber) => {
    if (!contactNumber) {
      return 'Contact number is required';
    }
    // Remove all non-digits for validation
    const numbers = contactNumber.replace(/\D/g, '');
    if (!/^\d+$/.test(numbers)) {
      return 'Contact number must contain only numbers';
    }
    if (numbers.length < 10) {
      return 'Contact number must be at least 10 digits';
    }
    if (numbers.length > 15) {
      return 'Contact number must be 15 digits or less';
    }
    // Check for common invalid patterns
    if (/^(\d)\1{9,}$/.test(numbers)) {
      return 'Contact number cannot be all the same digit';
    }
    return '';
  };

  /**
   * Validate address
   * @param {string} address - The address to validate
   * @returns {string} - Error message or empty string
   */
  const validateAddress = (address) => {
    if (!address.trim()) {
      return 'Address is required';
    }
    if (address.trim().length < 10) {
      return 'Address must be at least 10 characters';
    }
    if (address.trim().length > 200) {
      return 'Address must be 200 characters or less';
    }
    // Check for minimum address components (should have street and number or similar)
    const addressParts = address.trim().split(/\s+/);
    if (addressParts.length < 3) {
      return 'Please provide a complete address (street, city, etc.)';
    }
    return '';
  };

  /**
   * Handle input blur event (when user leaves the field)
   * @param {Event} e - The input blur event
   */
  const handleInputBlur = (e) => {
    const { name, value } = e.target;
    let error = '';

    // Validate based on field type
    if (name === 'cardNumber') {
      error = validateCardNumber(cardData.cardNumber);
    } else if (name === 'expiryDate') {
      error = validateExpiryDate(cardData.expiryDate);
    } else if (name === 'cardName') {
      error = validateCardName(cardData.cardName);
    } else if (name === 'cvv') {
      error = validateCVV(cardData.cvv);
    } else if (name === 'deliveryName') {
      error = validateDeliveryName(deliveryData.name);
    } else if (name === 'contactNumber') {
      error = validateContactNumber(deliveryData.contactNumber);
    } else if (name === 'address') {
      error = validateAddress(deliveryData.address);
    }

    // Update error for this field
    const errorFieldName = name === 'deliveryName' ? 'deliveryName' : name;
    setErrors(prev => ({
      ...prev,
      [errorFieldName]: error
    }));
  };

  /**
   * Handle form input changes with validation
   * @param {Event} e - The input change event
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    let error = '';

    // Format and validate based on field type
    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
      error = validateCardNumber(formattedValue);
      setCardData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } else if (name === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
      error = validateExpiryDate(formattedValue);
      setCardData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } else if (name === 'cardName') {
      formattedValue = value;
      error = validateCardName(value);
      setCardData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } else if (name === 'cvv') {
      // Only allow digits
      formattedValue = value.replace(/\D/g, '');
      error = validateCVV(formattedValue);
      setCardData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } else if (name === 'deliveryName') {
      formattedValue = value;
      error = validateDeliveryName(value);
      setDeliveryData(prev => ({
        ...prev,
        name: formattedValue
      }));
    } else if (name === 'contactNumber') {
      formattedValue = formatContactNumber(value);
      error = validateContactNumber(formattedValue);
      setDeliveryData(prev => ({
        ...prev,
        contactNumber: formattedValue
      }));
    } else if (name === 'address') {
      formattedValue = value;
      error = validateAddress(value);
      setDeliveryData(prev => ({
        ...prev,
        address: formattedValue
      }));
    }

    // Update error for this field
    const errorFieldName = name === 'deliveryName' ? 'deliveryName' : name;
    setErrors(prev => ({
      ...prev,
      [errorFieldName]: error
    }));
  };

  /**
   * Validate all fields based on payment method
   * @returns {boolean} - True if all fields are valid
   */
  const validateAllFields = () => {
    if (paymentMethod === 'credit-card') {
      const cardNumberError = validateCardNumber(cardData.cardNumber);
      const cardNameError = validateCardName(cardData.cardName);
      const expiryDateError = validateExpiryDate(cardData.expiryDate);
      const cvvError = validateCVV(cardData.cvv);

      setErrors({
        ...errors,
        cardNumber: cardNumberError,
        cardName: cardNameError,
        expiryDate: expiryDateError,
        cvv: cvvError
      });

      return !cardNumberError && !cardNameError && !expiryDateError && !cvvError;
    } else if (paymentMethod === 'cash') {
      const deliveryNameError = validateDeliveryName(deliveryData.name);
      const contactNumberError = validateContactNumber(deliveryData.contactNumber);
      const addressError = validateAddress(deliveryData.address);

      setErrors({
        ...errors,
        deliveryName: deliveryNameError,
        contactNumber: contactNumberError,
        address: addressError
      });

      return !deliveryNameError && !contactNumberError && !addressError;
    }
    return true;
  };

  /**
   * Handle payment form submission
   * @param {Event} e - The form submit event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields based on payment method
    if (!validateAllFields()) {
      // Scroll to first error
      const firstErrorField = document.querySelector('.form-group .error-message');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Simulate payment processing
    let message = `Payment successful! Total: $${calculateTotal().toFixed(2)}\nThank you for your purchase!`;
    
    if (paymentMethod === 'cash') {
      message += `\n\nDelivery Details:\nName: ${deliveryData.name}\nContact: ${deliveryData.contactNumber}\nAddress: ${deliveryData.address}`;
    }
    
    alert(message);
    
    // Call the completion callback
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="checkout-overlay">
      <div className="checkout-modal">
        <div className="checkout-header">
          <h2>Checkout</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="checkout-content">
          {/* Order Summary */}
          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="summary-items">
              {cart.map(cartItem => {
                const product = getProduct(cartItem.id);
                if (!product) return null;
                
                return (
                  <div key={cartItem.id} className="summary-item">
                    <span>{product.name} x {cartItem.quantity}</span>
                    <span>${(product.price * cartItem.quantity).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
            <div className="summary-total">
              <strong>Total: ${calculateTotal().toFixed(2)}</strong>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="payment-section">
            <h3>Payment Method</h3>
            
            <div className="payment-methods">
              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="credit-card"
                  checked={paymentMethod === 'credit-card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>💳 Credit Card</span>
              </label>

              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>💵 Cash on Delivery</span>
              </label>
            </div>

            {/* Credit Card Form */}
            {paymentMethod === 'credit-card' && (
              <form className="payment-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardData.cardNumber}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    maxLength="19"
                    className={errors.cardNumber ? 'error' : ''}
                  />
                  {errors.cardNumber && (
                    <span className="error-message">{errors.cardNumber}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Cardholder Name</label>
                  <input
                    type="text"
                    name="cardName"
                    placeholder="John Doe"
                    value={cardData.cardName}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    maxLength="50"
                    className={errors.cardName ? 'error' : ''}
                  />
                  {errors.cardName && (
                    <span className="error-message">{errors.cardName}</span>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input
                      type="text"
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={cardData.expiryDate}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      maxLength="5"
                      className={errors.expiryDate ? 'error' : ''}
                    />
                    {errors.expiryDate && (
                      <span className="error-message">{errors.expiryDate}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      placeholder="123"
                      value={cardData.cvv}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      maxLength="4"
                      className={errors.cvv ? 'error' : ''}
                    />
                    {errors.cvv && (
                      <span className="error-message">{errors.cvv}</span>
                    )}
                  </div>
                </div>

                <button type="submit" className="pay-btn">
                  Pay ${calculateTotal().toFixed(2)}
                </button>
              </form>
            )}

            {/* Cash on Delivery */}
            {paymentMethod === 'cash' && (
              <form className="payment-form" onSubmit={handleSubmit}>
                <p className="payment-info-text">Pay with cash when your order is delivered.</p>
                
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="deliveryName"
                    placeholder="John Doe"
                    value={deliveryData.name}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    maxLength="50"
                    className={errors.deliveryName ? 'error' : ''}
                  />
                  {errors.deliveryName && (
                    <span className="error-message">{errors.deliveryName}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Contact Number</label>
                  <input
                    type="text"
                    name="contactNumber"
                    placeholder="123 456 7890"
                    value={deliveryData.contactNumber}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    maxLength="20"
                    className={errors.contactNumber ? 'error' : ''}
                  />
                  {errors.contactNumber && (
                    <span className="error-message">{errors.contactNumber}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Delivery Address</label>
                  <textarea
                    name="address"
                    placeholder="Enter your complete delivery address"
                    value={deliveryData.address}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    rows="4"
                    maxLength="200"
                    className={errors.address ? 'error' : ''}
                  />
                  {errors.address && (
                    <span className="error-message">{errors.address}</span>
                  )}
                </div>

                <button type="submit" className="pay-btn">
                  Place Order
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;

