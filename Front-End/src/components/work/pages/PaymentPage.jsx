import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PaymentPage.css';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get booking data from state (passed during navigation) or localStorage
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  // Payment form state
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    saveCard: false
  });

  // Load booking data
  useEffect(() => {
    const loadBookingData = async () => {
      try {
        // First check if we have data from navigation state
        if (location.state?.bookingData) {
          setBookingData(location.state.bookingData);
          setLoading(false);
          return;
        }

        // If not, try localStorage
        const pendingBooking = localStorage.getItem('pendingBooking');
        if (pendingBooking) {
          setBookingData(JSON.parse(pendingBooking));
          setLoading(false);
          return;
        }

        // No booking data found
        setError('No booking information found. Please start your booking again.');
        setLoading(false);
      } catch (err) {
        console.error('Error loading booking data:', err);
        setError('Failed to load booking details');
        setLoading(false);
      }
    };

    loadBookingData();
  }, [location.state]);

  // Calculate prices - TAX REMOVED, only 15% commission remains
  const calculatePrices = () => {
    if (!bookingData) return { subtotal: 0, total: 0 };

    const basePrice = bookingData.totalPrice || 0;
    // No tax calculation, total is just the base price
    const total = basePrice;

    return { subtotal: basePrice, total };
  };

  const prices = calculatePrices();

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    return parts.length ? parts.join(' ') : value;
  };

  // Format expiry date
  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setPaymentData(prev => ({ ...prev, cardNumber: formatted }));
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiryDate(e.target.value);
    setPaymentData(prev => ({ ...prev, expiryDate: formatted }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Validate card details
  const validateCardDetails = () => {
    if (!paymentData.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
      setError('Please enter a valid 16-digit card number');
      return false;
    }
    if (!paymentData.cardName.trim()) {
      setError('Please enter the name on card');
      return false;
    }
    if (!paymentData.expiryDate.match(/^\d{2}\/\d{2}$/)) {
      setError('Please enter a valid expiry date (MM/YY)');
      return false;
    }
    if (!paymentData.cvv.match(/^\d{3,4}$/)) {
      setError('Please enter a valid CVV');
      return false;
    }
    return true;
  };

  // Process payment and create booking
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateCardDetails()) {
      return;
    }

    if (!bookingData) {
      setError('No booking data found');
      return;
    }

    setProcessing(true);
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to complete payment');
      navigate('/login');
      return;
    }

    try {

      // Create the booking in database
      const bookingResponse = await fetch('http://localhost:5000/api/new-bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      });

      const bookingResult = await bookingResponse.json();

      if (!bookingResponse.ok) {
        if (bookingResponse.status === 409) {
          throw new Error(bookingResult.message || 'Your selected guide is no longer available. Please go back and choose another guide.');
        }
        throw new Error(bookingResult.message || 'Failed to create booking');
      }


      // Confirm the booking (marks as paid + creates guide assignment)
      const confirmResponse = await fetch(`http://localhost:5000/api/new-bookings/${bookingResult.data.id}/confirm`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const confirmResult = await confirmResponse.json();

      // Handle guide no-longer-available at payment time (409 Conflict)
      if (!confirmResponse.ok) {
        if (confirmResponse.status === 409) {
          throw new Error(confirmResult.message || 'Your selected guide is no longer available. Please go back and choose another guide.');
        }
        throw new Error(confirmResult.message || 'Failed to confirm booking');
      }

      // Clear temporary data
      localStorage.removeItem('selectedTour');
      localStorage.removeItem('selectedGuide');
      localStorage.removeItem('pendingBooking');

      // Build confirmation data to pass to the confirmation page
      const confirmationData = {
        bookingId: bookingResult.data?.id || bookingResult.data?.bookingId || null,
        tourName: bookingData.tourName,
        guideName: bookingData.guideName || null,
        bookingDate: bookingData.bookingDate,
        participants: bookingData.participants,
        duration: bookingData.duration || bookingData.selectedDuration,
        totalAmount: prices.total,
        specialRequests: bookingData.specialRequests || null,
      };

      // Save as fallback in localStorage
      localStorage.setItem('lastBookingDetails', JSON.stringify(confirmationData));

      // Navigate to confirmation page
      navigate('/booking-confirmation', { state: { confirmationData } });

    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleBackToBooking = () => {
    navigate('/booking');
  };

  if (loading) {
    return (
      <div className="payment-page loading">
        <div className="container">
          <div className="loading-spinner"></div>
          <p>Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (error && !bookingData) {
    return (
      <div className="payment-page error">
        <div className="container">
          <div className="error-card">
            <h2>No Booking Data Found</h2>
            <p>{error}</p>
            <button onClick={handleBackToBooking} className="btn-primary">
              Start New Booking
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="container">
        {/* Header */}
        <div className="payment-header">
          <h1 className="page-title">Secure Checkout</h1>
          <p className="page-subtitle">Complete your payment to confirm your Sri Lankan adventure</p>
        </div>

        {/* Progress Steps */}
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

        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        <div className="payment-grid">
          {/* Left Column - Payment Form */}
          <div className="payment-form-section">
            <h2 className="form-title">Card Payment</h2>
            
            <form onSubmit={handleSubmit} className="payment-form">
              {/* Card Preview */}
              <div className="card-preview">
                <div className="card-display">
                  <div className="card-brand">
                    {paymentData.cardNumber.startsWith('4') ? 'VISA' :
                     paymentData.cardNumber.startsWith('5') ? 'MASTERCARD' :
                     paymentData.cardNumber.startsWith('3') ? 'AMEX' : 'BANK CARD'}
                  </div>
                  <div className="card-chip">💳</div>
                  <div className="card-number">
                    {paymentData.cardNumber || '•••• •••• •••• ••••'}
                  </div>
                  <div className="card-details">
                    <div className="card-holder">
                      <span className="label">Card Holder</span>
                      <span className="value">{paymentData.cardName || 'YOUR NAME'}</span>
                    </div>
                    <div className="card-expiry">
                      <span className="label">Expires</span>
                      <span className="value">{paymentData.expiryDate || 'MM/YY'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Form Fields */}
              <div className="form-group">
                <label htmlFor="cardNumber" className="form-label">Card Number</label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={paymentData.cardNumber}
                  onChange={handleCardNumberChange}
                  className="form-input"
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  required
                  disabled={processing}
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
                  placeholder="JOHN DOE"
                  required
                  disabled={processing}
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
                    onChange={handleExpiryChange}
                    className="form-input"
                    placeholder="MM/YY"
                    maxLength="5"
                    required
                    disabled={processing}
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
                    placeholder="123"
                    maxLength="4"
                    required
                    disabled={processing}
                  />
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox">
                  <input
                    type="checkbox"
                    name="saveCard"
                    checked={paymentData.saveCard}
                    onChange={handleChange}
                    disabled={processing}
                  />
                  <span>Save this card for future payments</span>
                </label>
              </div>

              <div className="secure-badge">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <span>256-bit SSL Secure Encryption</span>
              </div>

              <button
                type="submit"
                className="pay-now-btn"
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

              <button
                type="button"
                onClick={handleBackToBooking}
                className="back-to-booking-btn"
                disabled={processing}
              >
                ← Back to Booking
              </button>
            </form>

            {/* Accepted Cards */}
            <div className="accepted-cards">
              <span>Accepted Cards:</span>
              <span className="card-icons">
                <span>💳 VISA</span>
                <span>💳 Mastercard</span>
                <span>💳 Amex</span>
              </span>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="order-summary-section">
            <h2 className="summary-title">Order Summary</h2>

            {/* Tour Details */}
            {bookingData && (
              <>
                <div className="summary-card">
                  <h3 className="summary-subtitle">Tour Details</h3>
                  <div className="summary-item">
                    <span className="item-label">Tour Name:</span>
                    <span className="item-value">{bookingData.tourName}</span>
                  </div>
                  <div className="summary-item">
                    <span className="item-label">Duration:</span>
                    <span className="item-value">{bookingData.duration} days</span>
                  </div>
                  <div className="summary-item">
                    <span className="item-label">Participants:</span>
                    <span className="item-value">{bookingData.participants} persons</span>
                  </div>
                  <div className="summary-item">
                    <span className="item-label">Booking Date:</span>
                    <span className="item-value">
                      {new Date(bookingData.bookingDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Guide Details */}
                {bookingData.guideName && (
                  <div className="summary-card">
                    <h3 className="summary-subtitle">Tour Guide</h3>
                    <div className="summary-item">
                      <span className="item-label">Guide:</span>
                      <span className="item-value">{bookingData.guideName}</span>
                    </div>
                  </div>
                )}

                {/* Price Breakdown - TAX REMOVED */}
                <div className="price-breakdown">
                  <h3 className="summary-subtitle">Price Breakdown</h3>
                  
                  <div className="price-row">
                    <span>Subtotal:</span>
                    <span>${prices.subtotal}</span>
                  </div>
                  <div className="price-row total">
                    <span>Total Amount:</span>
                    <span>${prices.total}</span>
                  </div>
                  <p className="price-note" style={{ fontSize: '0.8rem', color: '#6c757d', marginTop: '0.5rem' }}>
                    * Includes 15% service fee
                  </p>
                </div>

                {/* Special Requests */}
                {bookingData.specialRequests && (
                  <div className="special-requests">
                    <h3 className="summary-subtitle">Special Requests</h3>
                    <p>{bookingData.specialRequests}</p>
                  </div>
                )}
              </>
            )}

            {/* Refund Policy */}
            <div className="guarantee-box refund-policy-box">
              <div className="guarantee-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <div className="guarantee-text">
                <h4>Cancellation &amp; Refund Policy</h4>
                <ul className="refund-list">
                  <li>Cancel before tour starts → <strong>50% refund</strong></li>
                  <li>Refund processed in 5–7 business days</li>
                  <li>No refund after tour has started</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;