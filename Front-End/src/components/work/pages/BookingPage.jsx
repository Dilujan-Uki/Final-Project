import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './BookingPage.css';

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const tourId = queryParams.get('tour');
  const tourName = queryParams.get('name') || "Cultural Triangle Explorer";
  const duration = parseInt(queryParams.get('duration')) || 3;
  const pricePerDay = parseInt(queryParams.get('pricePerDay')) || 80;

  const guideId = queryParams.get('guide');
  const guideName = queryParams.get('guideName') || "";
  const guideDailyRate = parseInt(queryParams.get('guideDailyRate')) || 0;
  const guideDbId = queryParams.get('guideDbId') || '';

  const [bookingData, setBookingData] = useState({
    tourId: tourId || '',
    tourName: decodeURIComponent(tourName),
    guideName: guideName ? decodeURIComponent(guideName) : '',
    participants: 2,
    selectedDuration: duration,
    extraServices: { transport: false, meals: false },
    bookingDate: '',
    specialRequests: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dateError, setDateError] = useState('');
  const [guideAvailCheck, setGuideAvailCheck] = useState(null);
  const [guideCheckLoading, setGuideCheckLoading] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

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
      setBookingData(prev => ({ ...prev, guideName: guideData.name }));
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setBookingData(prev => ({
      ...prev,
      bookingDate: tomorrow.toISOString().split('T')[0]
    }));
  }, [tourId, guideId, duration]);

  const checkGuideDateAvailability = useCallback(async (date, dur) => {
    if (!guideDbId || !date || !dur) return;
    const today = new Date(); today.setHours(0,0,0,0);
    const selected = new Date(date); selected.setHours(0,0,0,0);
    if (selected < today) {
      setDateError('Booking date cannot be in the past. Please select today or a future date.');
      setGuideAvailCheck(null);
      return;
    }
    setDateError('');
    const token = localStorage.getItem('token');
    if (!token) return;
    const endDateObj = new Date(date);
    endDateObj.setDate(endDateObj.getDate() + parseInt(dur));
    const endDate = endDateObj.toISOString().split('T')[0];
    setGuideCheckLoading(true);
    try {
      const resp = await fetch(
        `http://localhost:5000/api/new-booking/check-guide-dates?guideId=${guideDbId}&startDate=${date}&endDate=${endDate}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await resp.json();
      if (data.success) setGuideAvailCheck({ available: data.available, message: data.message });
    } catch (err) {
      console.error('Guide availability check failed:', err);
    } finally {
      setGuideCheckLoading(false);
    }
  }, [guideDbId]);

  useEffect(() => {
    if (bookingData.bookingDate && bookingData.selectedDuration) {
      checkGuideDateAvailability(bookingData.bookingDate, bookingData.selectedDuration);
    }
  }, [bookingData.bookingDate, bookingData.selectedDuration, checkGuideDateAvailability]);

  // Calculate prices
  const calculatePrices = () => {
    const baseTourPrice = bookingData.selectedDuration * pricePerDay * bookingData.participants;
    const guideCost = guideDailyRate * bookingData.selectedDuration;

    let extraServicesCost = 0;
    if (bookingData.extraServices.transport) extraServicesCost += 100;
    if (bookingData.extraServices.meals) extraServicesCost += 30 * bookingData.participants * bookingData.selectedDuration;

    const subtotal = baseTourPrice + guideCost + extraServicesCost;
    const serviceFee = Math.round(subtotal * 0.15);
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

  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');

  if (!token || !userData) {
    alert('Please login to book a tour');
    navigate('/login');
    return;
  }

  // Past-date guard on the frontend too
  const today = new Date(); today.setHours(0,0,0,0);
  const selectedDate = new Date(bookingData.bookingDate); selectedDate.setHours(0,0,0,0);
  if (selectedDate < today) {
    setDateError('Booking date cannot be in the past. Please select today or a future date.');
    return;
  }

  // Block if guide is not available for the dates
  if (guideDbId && guideAvailCheck && !guideAvailCheck.available) {
    setError('The selected guide is not available for your chosen dates. Please change the dates or choose a different guide.');
    return;
  }

  setLoading(true);
  setError('');

  try {
    const bookingPayload = {
      tourId: tourId || bookingData.tourId,
      tourName: bookingData.tourName,
      guideName: bookingData.guideName || '',
      guideId: guideDbId || null,
      participants: parseInt(bookingData.participants),
      duration: parseInt(bookingData.selectedDuration),
      totalPrice: prices.total,
      extraServices: {
        transport: bookingData.extraServices.transport || false,
        meals: bookingData.extraServices.meals || false
      },
      bookingDate: bookingData.bookingDate,
      specialRequests: bookingData.specialRequests || ''
    };

    localStorage.setItem('pendingBooking', JSON.stringify(bookingPayload));
    navigate('/payment', { state: { bookingData: bookingPayload } });

  } catch (err) {
    console.error('Booking error:', err);
    setError(err.message || 'Booking failed. Please try again.');
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

  const handleViewItinerary = () => {
    navigate(`/tour-itinerary/${tourId || bookingData.tourId}`);
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

        {/* Guide request notification banner */}
        {guideDbId && bookingData.guideName && (
          <div className="info-banner guide-request-banner">
            <span>📬</span>
            <div>
              <strong>How guide booking works:</strong> After submitting, a request will be sent to <strong>{decodeURIComponent(guideName)}</strong>. They will accept or decline. If declined, you can choose another guide.
            </div>
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
                      className={`form-input ${dateError ? 'input-error' : ''}`}
                      required
                      min={todayStr}
                    />
                    {dateError && <p className="field-error">{dateError}</p>}
                    {guideDbId && !dateError && bookingData.bookingDate && (
                      guideCheckLoading ? (
                        <p className="field-hint">⏳ Checking guide availability for these dates...</p>
                      ) : guideAvailCheck ? (
                        guideAvailCheck.available ? (
                          <p className="field-success">✅ {decodeURIComponent(guideName)} is available for these dates!</p>
                        ) : (
                          <p className="field-error">❌ {guideAvailCheck.message} Please change the dates or choose a different guide.</p>
                        )
                      ) : null
                    )}
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
                <div>
                  <button 
                    onClick={handleViewItinerary}
                    className="view-itinerary-link"
                    style={{ 
                      marginRight: '1rem', 
                      color: '#ffb400',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      fontSize: '0.85rem'
                    }}
                  >
                    View Itinerary
                  </button>
                  <button onClick={handleChangeTour} className="change-btn">
                    Change
                  </button>
                </div>
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