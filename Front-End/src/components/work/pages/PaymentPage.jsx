// src/pages/PaymentPage.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PaymentPage.css';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const tourId = queryParams.get('tour');
  
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    saveCard: false
  });

  const tourDetails = {
    name: "Cultural Triangle Explorer",
    price: 299,
    duration: "3 Days",
    participants: 2
  };

  const calculateTotal = () => {
    return tourDetails.price * tourDetails.participants;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Payment submitted:', paymentData);
    alert('Payment Successful! Your booking is confirmed.');
    navigate('/');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setPaymentData(prev => ({
      ...prev,
      cardNumber: formatted
    }));
  };

  return (
    <div className="payment-page">
      <div className="container">
        <div className="payment-header">
          <h1 className="page-title">Secure Payment</h1>
          <p className="page-subtitle">Complete your booking with secure payment</p>
        </div>

        <div className="payment-content">
          {/* Order Summary */}
          <div className="order-summary">
            <div className="summary-header">
              <h2 className="summary-title">Order Summary</h2>
            </div>
            
            <div className="tour-details">
              <h3 className="tour-name">{tourDetails.name}</h3>
              <div className="tour-info">
                <div className="info-row">
                  <span className="info-label">Duration:</span>
                  <span className="info-value">{tourDetails.duration}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Participants:</span>
                  <span className="info-value">{tourDetails.participants} persons</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Price per person:</span>
                  <span className="info-value">${tourDetails.price}</span>
                </div>
              </div>
            </div>
            
            <div className="price-breakdown">
              <div className="price-row">
                <span>Subtotal:</span>
                <span>${calculateTotal()}</span>
              </div>
              <div className="price-row">
                <span>Service Fee:</span>
                <span>$15.00</span>
              </div>
              <div className="price-total">
                <span>Total Amount:</span>
                <span className="total-amount">${calculateTotal() + 15}</span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="payment-form-section">
            <form onSubmit={handleSubmit} className="payment-form">
              <div className="form-section">
                <h3 className="section-title">Card Details</h3>
                
                <div className="form-group">
                  <label htmlFor="cardNumber" className="form-label">Card Number</label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={paymentData.cardNumber}
                    onChange={handleCardNumberChange}
                    className="form-input"
                    required
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="cardName" className="form-label">Name on Card</label>
                  <input
                    type="text"
                    id="cardName"
                    name="cardName"
                    value={paymentData.cardName}
                    onChange={handleChange}
                    className="form-input"
                    required
                    placeholder="John Doe"
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="expiryDate" className="form-label">Expiry Date</label>
                    <input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      value={paymentData.expiryDate}
                      onChange={handleChange}
                      className="form-input"
                      required
                      placeholder="MM/YY"
                      maxLength="5"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="cvv" className="form-label">CVV</label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={paymentData.cvv}
                      onChange={handleChange}
                      className="form-input"
                      required
                      placeholder="123"
                      maxLength="4"
                    />
                  </div>
                </div>
                
                <label className="checkbox">
                  <input
                    type="checkbox"
                    name="saveCard"
                    checked={paymentData.saveCard}
                    onChange={handleChange}
                  />
                  <span>Save card for future payments</span>
                </label>
              </div>

              <div className="form-section">
                <h3 className="section-title">Billing Address</h3>
                
                <div className="form-group">
                  <label htmlFor="address" className="form-label">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    className="form-input"
                    required
                    placeholder="Enter your address"
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city" className="form-label">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      className="form-input"
                      required
                      placeholder="Enter city"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="zip" className="form-label">ZIP Code</label>
                    <input
                      type="text"
                      id="zip"
                      name="zip"
                      className="form-input"
                      required
                      placeholder="ZIP code"
                    />
                  </div>
                </div>
              </div>

              <div className="terms-agreement">
                <label className="checkbox">
                  <input type="checkbox" required />
                  <span>
                    I agree to the <a href="/terms">Terms & Conditions</a> and{' '}
                    <a href="/privacy">Privacy Policy</a>
                  </span>
                </label>
              </div>

              <button type="submit" className="submit-btn">
                Pay ${calculateTotal() + 15}
              </button>

              <p className="security-note">
                🔒 Your payment is secured with SSL encryption
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;