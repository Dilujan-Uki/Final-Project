// src/pages/BookingPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './BookingPage.css';

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  // Get tour and guide details from URL parameters
  const tourId = queryParams.get('tour');
  const tourName = queryParams.get('name') || "Cultural Triangle Explorer";
  const duration = parseInt(queryParams.get('duration')) || 3;
  const pricePerDay = parseInt(queryParams.get('pricePerDay')) || 80;
  
  const guideId = queryParams.get('guide');
  const guideName = queryParams.get('guideName') || "";
  const guideDailyRate = parseInt(queryParams.get('guideDailyRate')) || 0;

  const [bookingData, setBookingData] = useState({
    tourId: tourId || '',
    tourName: decodeURIComponent(tourName),
    guideName: guideName ? decodeURIComponent(guideName) : '',
    participants: 2,
    selectedDuration: duration,
    extraServices: {
      transport: false,
      meals: false
    },
    bookingDate: '',
    specialRequests: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load saved selections from localStorage
  useEffect(() => {
    const savedTour = localStorage.getItem('selectedTour');
    const savedGuide = localStorage.getItem('selectedGuide');
    
    if (savedTour && !tourId) {
      const tourData = JSON.parse(savedTour);
      setBookingData(prev => ({
        ...prev,
        tourId: tourData.id,
        tourName: tourData.name,
        selectedDuration: tourData.duration || duration
      }));
    }
    
    if (savedGuide && !guideId) {
      const guideData = JSON.parse(savedGuide);
      setBookingData(prev => ({
        ...prev,
        guideName: guideData.name
      }));
    }

    // Set booking date to tomorrow by default
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setBookingData(prev => ({
      ...prev,
      bookingDate: tomorrow.toISOString().split('T')[0]
    }));
  }, [tourId, guideId, duration]);

  // Calculate prices
  const calculatePrices = () => {
    const baseTourPrice = bookingData.selectedDuration * pricePerDay * bookingData.participants;
    const guideCost = guideDailyRate * bookingData.selectedDuration;
    
    let extraServicesCost = 0;
    if (bookingData.extraServices.transport) extraServicesCost += 100;
    if (bookingData.extraServices.meals) extraServicesCost += 30 * bookingData.participants * bookingData.selectedDuration;
    
    const subtotal = baseTourPrice + guideCost + extraServicesCost;
    const serviceFee = 15;
    const total = subtotal + serviceFee;
    
    return { 
      baseTourPrice, 
      guideCost, 
      extraServicesCost, 
      subtotal, 
      serviceFee, 
      total 
    };
  };

  const prices = calculatePrices();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to book a tour');
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const bookingPayload = {
        tourId: bookingData.tourId,
        guide: bookingData.guideName,
        participants: bookingData.participants,
        duration: bookingData.selectedDuration,
        totalPrice: prices.total,
        extraServices: bookingData.extraServices,
        bookingDate: bookingData.bookingDate,
        specialRequests: bookingData.specialRequests
      };

      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingPayload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Booking failed');
      }

      // Clear selections after successful booking
      localStorage.removeItem('selectedTour');
      localStorage.removeItem('selectedGuide');

      alert('Booking Successful! Redirecting to payment...');
      
      // Navigate to payment page with booking ID
      navigate(`/payment?booking=${data.data._id}&amount=${prices.total}`);
      
    } catch (err) {
      setError(err.message || 'Booking failed. Please try again.');
      console.error('Booking error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setBookingData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? e.target.checked : value
        }
      }));
    } else {
      setBookingData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? e.target.checked : value
      }));
    }
  };

  const handleServiceToggle = (serviceName) => {
    setBookingData(prev => ({
      ...prev,
      extraServices: {
        ...prev.extraServices,
        [serviceName]: !prev.extraServices[serviceName]
      }
    }));
  };

  const handleChangeTour = () => {
    navigate('/tours');
  };

  const handleChangeGuide = () => {
    navigate('/tour-guides');
  };

  return (
    <div className="booking-page">
      <div className="container">
        <div className="booking-header">
          <h1 className="page-title">Complete Your Booking</h1>
          <p className="page-subtitle">Review your selections and enter booking details</p>
        </div>

        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        <div className="booking-container">
          {/* Left Column - Booking Form */}
          <div className="booking-form-section">
            <h2 className="form-section-title">Booking Details</h2>
            
            <form onSubmit={handleSubmit} className="booking-form">
              {/* Date & Participants */}
              <div className="form-section">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="bookingDate" className="form-label">Booking Date *</label>
                    <input
                      type="date"
                      id="bookingDate"
                      name="bookingDate"
                      value={bookingData.bookingDate}
                      onChange={handleChange}
                      className="form-input"
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="participants" className="form-label">Participants *</label>
                    <input
                      type="number"
                      id="participants"
                      name="participants"
                      min="1"
                      max="30"
                      value={bookingData.participants}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="selectedDuration" className="form-label">Duration (Days) *</label>
                  <input
                    type="number"
                    id="selectedDuration"
                    name="selectedDuration"
                    min="1"
                    max="30"
                    value={bookingData.selectedDuration}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              {/* Special Requests */}
              <div className="form-section">
                <div className="section-header">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <h3>Special Requests</h3>
                </div>
                
                <div className="form-group">
                  <textarea
                    id="specialRequests"
                    name="specialRequests"
                    value={bookingData.specialRequests}
                    onChange={handleChange}
                    className="form-textarea"
                    placeholder="Any special requests or requirements..."
                    rows="4"
                  />
                </div>
              </div>

              {/* Extra Services */}
              <div className="form-section">
                <div className="section-header">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <h3>Extra Services</h3>
                </div>
                
                <div className="services-list">
                  <div 
                    className={`service-item ${bookingData.extraServices.transport ? 'selected' : ''}`}
                    onClick={() => handleServiceToggle('transport')}
                  >
                    <input
                      type="checkbox"
                      id="transport"
                      className="service-checkbox"
                      checked={bookingData.extraServices.transport}
                      onChange={() => handleServiceToggle('transport')}
                    />
                    <div className="service-info">
                      <div className="service-name">Private Transport</div>
                      <div className="service-price">$100 flat fee</div>
                      <div className="service-description">Comfortable private vehicle with driver</div>
                    </div>
                  </div>
                  
                  <div 
                    className={`service-item ${bookingData.extraServices.meals ? 'selected' : ''}`}
                    onClick={() => handleServiceToggle('meals')}
                  >
                    <input
                      type="checkbox"
                      id="meals"
                      className="service-checkbox"
                      checked={bookingData.extraServices.meals}
                      onChange={() => handleServiceToggle('meals')}
                    />
                    <div className="service-info">
                      <div className="service-name">Full Board Meals</div>
                      <div className="service-price">$30 per person/day</div>
                      <div className="service-description">Breakfast, lunch, and dinner included</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="form-section">
                <div className="section-header">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <h3>Contact Information</h3>
                </div>
                
                <div className="form-group">
                  <label htmlFor="contactEmail" className="form-label">Email for confirmation *</label>
                  <input
                    type="email"
                    id="contactEmail"
                    name="contactEmail"
                    className="form-input"
                    required
                    placeholder="your@email.com"
                    defaultValue={JSON.parse(localStorage.getItem('user'))?.email || ''}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="contactPhone" className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    id="contactPhone"
                    name="contactPhone"
                    className="form-input"
                    required
                    placeholder="+94 77 123 4567"
                    defaultValue={JSON.parse(localStorage.getItem('user'))?.phone || ''}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Confirm Booking & Proceed to Payment'}
              </button>
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
                  {bookingData.tourName}
                </h3>
                <button onClick={handleChangeTour} className="change-btn">
                  Change
                </button>
              </div>
              
              <div className="tour-details">
                <div className="tour-detail-item">
                  <span className="detail-label">Price per day</span>
                  <span className="detail-value">${pricePerDay}/person</span>
                </div>
                <div className="tour-detail-item">
                  <span className="detail-label">Duration</span>
                  <span className="detail-value">{bookingData.selectedDuration} days</span>
                </div>
              </div>
            </div>

            {/* Guide Info */}
            {bookingData.guideName && (
              <div className="tour-info-card">
                <div className="tour-header">
                  <h3 className="tour-name">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    {bookingData.guideName}
                  </h3>
                  <button onClick={handleChangeGuide} className="change-btn">
                    Change
                  </button>
                </div>
                
                <div className="tour-details">
                  <div className="tour-detail-item">
                    <span className="detail-label">Daily Rate</span>
                    <span className="detail-value">${guideDailyRate}/day</span>
                  </div>
                </div>
              </div>
            )}

            {/* Price Breakdown */}
            <div className="price-breakdown">
              <h4 className="services-title">Price Breakdown</h4>
              
              <div className="price-row">
                <span>Base Tour Price ({bookingData.participants} x {bookingData.selectedDuration} days)</span>
                <span className="price-amount">${prices.baseTourPrice}</span>
              </div>
              
              {bookingData.guideName && (
                <div className="price-row">
                  <span>Tour Guide ({bookingData.selectedDuration} days)</span>
                  <span className="price-amount">${prices.guideCost}</span>
                </div>
              )}
              
              {bookingData.extraServices.transport && (
                <div className="price-row">
                  <span>Private Transport</span>
                  <span className="price-amount">$100</span>
                </div>
              )}
              
              {bookingData.extraServices.meals && (
                <div className="price-row">
                  <span>Meals ({bookingData.participants} x {bookingData.selectedDuration} days)</span>
                  <span className="price-amount">${30 * bookingData.participants * bookingData.selectedDuration}</span>
                </div>
              )}
              
              <div className="price-row">
                <span>Service Fee</span>
                <span className="price-amount">${prices.serviceFee}</span>
              </div>
              
              <div className="price-row total">
                <span>Total Amount</span>
                <span className="price-amount total">${prices.total}</span>
              </div>
            </div>

            {/* Booking Terms */}
            <div className="terms-section">
              <h4 className="services-title">Booking Terms</h4>
              <div className="terms-content">
                <p>• 50% deposit required to confirm booking</p>
                <p>• Full payment due 7 days before tour date</p>
                <p>• Cancellation: 50% refund if cancelled 14+ days before</p>
                <p>• No refund for cancellation within 7 days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;