// src/pages/PaymentPage.jsx - UPDATED to use state instead of URL params
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

  // Load data from state or localStorage
  useEffect(() => {
    // If we have state from navigation, use it
    if (tour) {
      setTourData(tour);
      localStorage.setItem('selectedTour', JSON.stringify(tour));
    } else {
      // Fallback to localStorage
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to book a tour');
      navigate('/login');
      return;
    }
    
    console.log('Payment submitted:', paymentData);
    console.log('Tour data:', tourData);
    console.log('Guide data:', guideData);
    
    localStorage.removeItem('selectedTour');
    localStorage.removeItem('selectedGuide');
    
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

  const extraServicesList = [
    {
      id: 'transport',
      name: 'Private Transport',
      price: 100,
      description: '$100 flat fee',
      checked: customization.extraServices.transport
    },
    {
      id: 'meals',
      name: 'Full Board Meals',
      price: 30,
      description: '$30 per person/day',
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
          <h1 className="page-title">Complete Your Booking</h1>
          <p className="page-subtitle">Review your selections and enter payment details</p>
        </div>

        <div className="payment-container">
          {/* Left Column - Payment Form */}
          <div className="payment-form-section">
            <h2 className="form-section-title">Payment Details</h2>
            
            <form onSubmit={handleSubmit} className="payment-form">
              {/* Card Details */}
              <div className="form-section">
                <div className="section-header">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                    <line x1="1" y1="10" x2="23" y2="10"></line>
                  </svg>
                  <h3>Card Information</h3>
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

              {/* Billing Address */}
              <div className="form-section">
                <div className="section-header">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <h3>Billing Address</h3>
                </div>
                
                <div className="form-group">
                  <label htmlFor="address" className="form-label">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    className="form-input"
                    required
                    placeholder="1234 Main Street"
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
                      placeholder="Colombo"
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
                      placeholder="00100"
                    />
                  </div>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="form-section">
                <label className="checkbox">
                  <input type="checkbox" required />
                  <span>
                    I agree to the <a href="/terms" className="text-link">Terms & Conditions</a> and{' '}
                    <a href="/privacy" className="text-link">Privacy Policy</a>
                  </span>
                </label>
              </div>
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="order-summary-section">
            <h2 className="summary-title">Order Summary</h2>
            
            {/* Tour Info */}
            <div className="tour-info-card">
              <div className="tour-header">
                <h3 className="tour-name">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                <span>Base Tour Price</span>
                <span className="price-amount">${prices.baseTourPrice}</span>
              </div>
              
              {guideData && (
                <div className="price-row">
                  <span>Tour Guide</span>
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
              <button type="submit" onClick={handleSubmit} className="submit-btn">
                Pay ${prices.total} - Complete Booking
              </button>
              
              <p className="security-note">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                Your payment is secured with SSL encryption
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;