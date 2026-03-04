// src/pages/PaymentPage.jsx - COMPLETE REPLACE
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PaymentPage.css';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get data from state (passed during navigation)
  const { tour, guide } = location.state || {};

  // If no state, try to get from localStorage as fallback
  const [tourData, setTourData] = useState(null);
  const [guideData, setGuideData] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    saveCard: false
  });

  const [customization, setCustomization] = useState({
    participants: 2,
    selectedDuration: tour?.duration || 3,
    extraServices: {
      transport: false,
      meals: false
    }
  });

  // Payment method options
  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: '💳', description: 'Pay securely with your card' },
    { id: 'paypal', name: 'PayPal', icon: '🅿️', description: 'Pay with your PayPal account' },
    { id: 'applepay', name: 'Apple Pay', icon: '📱', description: 'Fast and secure with Apple' },
    { id: 'googlepay', name: 'Google Pay', icon: '🅶', description: 'Pay with your Google account' }
  ];

  // Load data from state or localStorage
  useEffect(() => {
    if (tour) {
      setTourData(tour);
      localStorage.setItem('selectedTour', JSON.stringify(tour));
    } else {
      const savedTour = localStorage.getItem('selectedTour');
      if (savedTour) {
        setTourData(JSON.parse(savedTour));
      }
    }

    if (guide) {
      setGuideData(guide);
      localStorage.setItem('selectedGuide', JSON.stringify(guide));
    } else {
      const savedGuide = localStorage.getItem('selectedGuide');
      if (savedGuide) {
        setGuideData(JSON.parse(savedGuide));
      }
    }
  }, [tour, guide]);

  // Calculate prices based on customization
  const calculatePrices = () => {
    if (!tourData) return { baseTourPrice: 0, guideCost: 0, extraServicesCost: 0, subtotal: 0, serviceFee: 0, total: 0 };

    const baseTourPrice = customization.selectedDuration * (tourData.pricePerDay || 80) * customization.participants;
    const guideCost = (guideData?.dailyRate || 0) * customization.selectedDuration;

    let extraServicesCost = 0;
    if (customization.extraServices.transport) extraServicesCost += 100;
    if (customization.extraServices.meals) extraServicesCost += 30 * customization.participants * customization.selectedDuration;

    const subtotal = baseTourPrice + guideCost + extraServicesCost;
    const serviceFee = Math.round(subtotal * 0.15 * 100) / 100;
    const total = subtotal + serviceFee;

    return { baseTourPrice, guideCost, extraServicesCost, subtotal, serviceFee, total };
  };

  const prices = calculatePrices();

  // In the handleSubmit function, after successful payment:

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to complete payment');
      navigate('/login');
      return;
    }

    // Simulate payment processing
    setTimeout(async () => {
      try {
        // After payment success, confirm the booking
        // You'll need the booking ID - you should store it from the booking response
        const bookingId = localStorage.getItem('lastBookingId');

        if (bookingId) {
          await fetch(`http://localhost:5000/api/new-bookings/${bookingId}/confirm`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
        }

        localStorage.removeItem('selectedTour');
        localStorage.removeItem('selectedGuide');
        localStorage.removeItem('lastBookingId');

        alert('Payment Successful! Your booking is confirmed.');
        navigate('/account?tab=bookings');
      } catch (error) {
        console.error('Error confirming booking:', error);
      } finally {
        setProcessing(false);
      }
    }, 2000);
  };
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCustomizationChange = (e) => {
    const { name, value, type } = e.target;

    setCustomization(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? e.target.checked : parseInt(value)
    }));
  };

  const handleServiceToggle = (serviceName) => {
    setCustomization(prev => ({
      ...prev,
      extraServices: {
        ...prev.extraServices,
        [serviceName]: !prev.extraServices[serviceName]
      }
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

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiryDate(e.target.value);
    setPaymentData(prev => ({
      ...prev,
      expiryDate: formatted
    }));
  };

  const extraServicesList = [
    {
      id: 'transport',
      name: 'Private Transport',
      price: 100,
      description: '$100 flat fee - Comfortable private vehicle with driver',
      checked: customization.extraServices.transport
    },
    {
      id: 'meals',
      name: 'Full Board Meals',
      price: 30,
      description: '$30 per person/day - Breakfast, lunch & dinner',
      checked: customization.extraServices.meals
    }
  ];

  const handleChangeTour = () => {
    navigate('/tours');
  };

  const handleChangeGuide = () => {
    navigate('/tour-guides');
  };

  // If no data, show loading or redirect
  if (!tourData) {
    return (
      <div className="loading-page">
        <div className="loading-spinner"></div>
        <p>Loading booking details...</p>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="container">
        <div className="payment-header">
          <h1 className="page-title">Secure Checkout</h1>
          <p className="page-subtitle">Complete your payment to confirm your Sri Lankan adventure</p>
        </div>

        {/* Progress Bar */}
        <div className="payment-progress">
          <div className="progress-step completed">
            <span className="step-number">1</span>
            <span className="step-label">Booking Details</span>
          </div>
          <div className="progress-step active">
            <span className="step-number">2</span>
            <span className="step-label">Payment</span>
          </div>
          <div className="progress-step">
            <span className="step-number">3</span>
            <span className="step-label">Confirmation</span>
          </div>
        </div>

        <div className="payment-container">
          {/* Left Column - Payment Form */}
          <div className="payment-form-section">
            <h2 className="form-section-title">Payment Method</h2>

            {/* Payment Method Selection */}
            <div className="payment-methods">
              {paymentMethods.map(method => (
                <div
                  key={method.id}
                  className={`payment-method ${selectedPaymentMethod === method.id ? 'active' : ''}`}
                  onClick={() => setSelectedPaymentMethod(method.id)}
                >
                  <span className="method-icon">{method.icon}</span>
                  <div className="method-info">
                    <span className="method-name">{method.name}</span>
                    <span className="method-description">{method.description}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Card Payment Form */}
            {selectedPaymentMethod === 'card' && (
              <form onSubmit={handleSubmit} className="payment-form">
                <div className="form-section">
                  <div className="section-header">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                      <line x1="1" y1="10" x2="23" y2="10"></line>
                    </svg>
                    <h3>Card Information</h3>
                  </div>

                  <div className="card-preview">
                    <div className="card-display">
                      <div className="card-chip">💳</div>
                      <div className="card-number-display">
                        {paymentData.cardNumber || '•••• •••• •••• ••••'}
                      </div>
                      <div className="card-details-display">
                        <div className="card-name-display">
                          {paymentData.cardName || 'CARDHOLDER NAME'}
                        </div>
                        <div className="card-expiry-display">
                          {paymentData.expiryDate || 'MM/YY'}
                        </div>
                      </div>
                      <div className="card-type">
                        {paymentData.cardNumber.startsWith('4') ? 'VISA' :
                          paymentData.cardNumber.startsWith('5') ? 'MASTERCARD' :
                            paymentData.cardNumber.startsWith('3') ? 'AMEX' : 'CARD'}
                      </div>
                    </div>
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

                  <div className="form-group input-with-icon">
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
                    <span className="card-icon">💳</span>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="expiryDate" className="form-label">Expiry Date</label>
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        value={paymentData.expiryDate}
                        onChange={handleExpiryChange}
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
                    <span>Save this card for future payments</span>
                  </label>

                  <div className="secure-badge">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    <span>256-bit SSL Secure Encryption</span>
                  </div>
                </div>
              </form>
            )}

            {/* PayPal Section */}
            {selectedPaymentMethod === 'paypal' && (
              <div className="alternative-payment">
                <div className="payment-info">
                  <p>You'll be redirected to PayPal to complete your payment securely.</p>
                  <button className="paypal-button">
                    <span className="paypal-icon">🅿️</span>
                    Continue with PayPal
                  </button>
                </div>
              </div>
            )}

            {/* Apple Pay Section */}
            {selectedPaymentMethod === 'applepay' && (
              <div className="alternative-payment">
                <div className="payment-info">
                  <p>Pay quickly and securely with Apple Pay on your compatible devices.</p>
                  <button className="applepay-button">
                    <span className="apple-icon">📱</span>
                    Pay with Apple Pay
                  </button>
                </div>
              </div>
            )}

            {/* Google Pay Section */}
            {selectedPaymentMethod === 'googlepay' && (
              <div className="alternative-payment">
                <div className="payment-info">
                  <p>Fast and secure checkout with Google Pay.</p>
                  <button className="googlepay-button">
                    <span className="google-icon">🅶</span>
                    Pay with Google Pay
                  </button>
                </div>
              </div>
            )}

            <div className="payment-guarantee">
              <div className="guarantee-item">
                <span>🔒</span>
                <span>Your data is protected</span>
              </div>
              <div className="guarantee-item">
                <span>💰</span>
                <span>Money-back guarantee</span>
              </div>
              <div className="guarantee-item">
                <span>✓</span>
                <span>No hidden fees</span>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="order-summary-section">
            <h2 className="summary-title">Order Summary</h2>

            {/* Tour Info */}
            <div className="tour-info-card">
              <div className="tour-header">
                <h3 className="tour-name">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
                  </svg>
                  {tourData?.name}
                </h3>
                <button onClick={handleChangeTour} className="change-btn">
                  Change
                </button>
              </div>

              <div className="tour-details">
                <div className="tour-detail-item">
                  <span className="detail-label">Price per day</span>
                  <span className="detail-value">${tourData?.pricePerDay}/person</span>
                </div>
                <div className="tour-detail-item">
                  <span className="detail-label">Duration</span>
                  <span className="detail-value">{tourData?.duration} days</span>
                </div>
              </div>
            </div>

            {/* Guide Info */}
            {guideData && (
              <div className="tour-info-card">
                <div className="tour-header">
                  <h3 className="tour-name">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    {guideData.name}
                  </h3>
                  <button onClick={handleChangeGuide} className="change-btn">
                    Change
                  </button>
                </div>

                <div className="tour-details">
                  <div className="tour-detail-item">
                    <span className="detail-label">Daily Rate</span>
                    <span className="detail-value">${guideData.dailyRate}/day</span>
                  </div>
                </div>
              </div>
            )}

            {/* Customization Controls */}
            <div className="customization-section">
              <h4 className="customization-title">Customize Your Package</h4>

              <div className="customization-controls">
                <div className="control-group">
                  <label htmlFor="participants" className="control-label">Participants</label>
                  <input
                    type="number"
                    id="participants"
                    name="participants"
                    min="1"
                    max="30"
                    value={customization.participants}
                    onChange={handleCustomizationChange}
                    className="control-input"
                  />
                </div>

                <div className="control-group">
                  <label htmlFor="selectedDuration" className="control-label">Duration (Days)</label>
                  <input
                    type="number"
                    id="selectedDuration"
                    name="selectedDuration"
                    min="1"
                    max="30"
                    value={customization.selectedDuration}
                    onChange={handleCustomizationChange}
                    className="control-input"
                  />
                </div>
              </div>
            </div>

            {/* Extra Services */}
            <div className="extra-services">
              <h4 className="services-title">Add Extra Services</h4>
              <div className="services-list">
                {extraServicesList.map((service) => (
                  <div
                    key={service.id}
                    className={`service-item ${service.checked ? 'selected' : ''}`}
                    onClick={() => handleServiceToggle(service.id)}
                  >
                    <input
                      type="checkbox"
                      id={`service-${service.id}`}
                      className="service-checkbox"
                      checked={service.checked}
                      onChange={() => handleServiceToggle(service.id)}
                    />
                    <div className="service-info">
                      <div className="service-name">{service.name}</div>
                      <div className="service-price">{service.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="price-breakdown">
              <h4 className="services-title">Price Breakdown</h4>

              <div className="price-row">
                <span>Base Tour Price ({customization.participants} x {customization.selectedDuration} days)</span>
                <span className="price-amount">${prices.baseTourPrice}</span>
              </div>

              {guideData && (
                <div className="price-row">
                  <span>Tour Guide ({customization.selectedDuration} days)</span>
                  <span className="price-amount">${prices.guideCost}</span>
                </div>
              )}

              {prices.extraServicesCost > 0 && (
                <div className="price-row">
                  <span>Extra Services</span>
                  <span className="price-amount">${prices.extraServicesCost}</span>
                </div>
              )}

              <div className="price-row subtotal">
                <span>Subtotal</span>
                <span className="price-amount">${prices.subtotal}</span>
              </div>

              <div className="price-row">
                <span>Service Fee (15%)</span>
                <span className="price-amount">${prices.serviceFee}</span>
              </div>

              <div className="price-row total">
                <span>Total Amount</span>
                <span className="price-amount total">${prices.total}</span>
              </div>
            </div>

            {/* Payment Actions */}
            <div className="payment-actions">
              <button
                type="submit"
                onClick={handleSubmit}
                className="submit-btn"
                disabled={processing}
              >
                {processing ? (
                  <>
                    <span className="processing-spinner"></span>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <span>🔒</span>
                    Pay ${prices.total} Securely
                  </>
                )}
              </button>

              <p className="security-note">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                Your payment information is encrypted and secure
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;