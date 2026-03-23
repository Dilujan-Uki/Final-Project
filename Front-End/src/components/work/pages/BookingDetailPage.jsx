import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getTourImage } from '../../../utils/tourImageMapping';
import './BookingDetailPage.css';

const BookingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBookingDetails = useCallback(async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/new-bookings/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch booking');
      }

      if (data.success) {
        setBooking(data.data);
      } else {
        setError('Booking not found');
      }
    } catch (err) {
      console.error('Error fetching booking:', err);
      setError(err.message || 'Failed to load booking details');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchBookingDetails();
  }, [fetchBookingDetails]);

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      weekday: 'long'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'confirmed': return 'Booked';
      case 'pending': return 'Pending Confirmation';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'confirmed': return 'status-booked';
      case 'pending': return 'status-pending';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="booking-detail-page loading">
        <div className="container">
          <div className="loading-spinner"></div>
          <p>Loading your booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="booking-detail-page error">
        <div className="container">
          <div className="error-card">
            <h2>Oops! Something went wrong</h2>
            <p>{error || 'Booking not found'}</p>
            <button onClick={() => navigate('/account')} className="btn-primary">
              Back to My Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tourImage = getTourImage({ name: booking.tourName });

  return (
    <div className="booking-detail-page">
      <div className="container">
        {/* Header with back button */}
        <div className="detail-header">
          <button onClick={() => navigate('/account')} className="back-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Account
          </button>
          <h1 className="page-title">Booking Details</h1>
        </div>

        {/* Main Content */}
        <div className="booking-detail-content">
          {/* Left Column - Tour Info */}
          <div className="detail-left">
            <div className="tour-image-section">
              <img src={tourImage} alt={booking.tourName} className="tour-detail-image" />
              <div className={`booking-status-large ${getStatusClass(booking.status)}`}>
                {getStatusDisplay(booking.status)}
              </div>
            </div>

            <div className="tour-info-section">
              <h2 className="tour-name-large">{booking.tourName}</h2>
              
              <div className="info-grid">
                <div className="info-card">
                  <div className="info-icon">📅</div>
                  <div className="info-content">
                    <span className="info-label">Booking Date</span>
                    <span className="info-value">{formatDate(booking.bookingDate)}</span>
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-icon">👥</div>
                  <div className="info-content">
                    <span className="info-label">Participants</span>
                    <span className="info-value">{booking.participants} {booking.participants === 1 ? 'Person' : 'People'}</span>
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-icon">⏱️</div>
                  <div className="info-content">
                    <span className="info-label">Duration</span>
                    <span className="info-value">{booking.duration} Days</span>
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-icon">💰</div>
                  <div className="info-content">
                    <span className="info-label">Total Price</span>
                    <span className="info-value price">${booking.totalPrice}</span>
                  </div>
                </div>
              </div>

              {booking.guideName && (
                <div className="guide-detail-card">
                  <h3>Your Tour Guide</h3>
                  <div className="guide-info">
                    <div className="guide-avatar">
                      {booking.guideName.charAt(0)}
                    </div>
                    <div className="guide-details">
                      <span className="guide-name">{booking.guideName}</span>
                      <span className="guide-label">Professional Guide</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="detail-right">
            <div className="summary-card">
              <h3>Booking Summary</h3>
              
              <div className="summary-item">
                <span>Booking ID</span>
                <span className="booking-id">{booking._id.slice(-8).toUpperCase()}</span>
              </div>

              <div className="summary-item">
                <span>Booked On</span>
                <span>{formatDate(booking.createdAt)}</span>
              </div>

              <div className="summary-item">
                <span>Status</span>
                <span className={`status-badge ${booking.status}`}>
                  {getStatusDisplay(booking.status)}
                </span>
              </div>

              <div className="summary-item">
                <span>Payment Status</span>
                <span className={`payment-status ${booking.paymentStatus}`}>
                  {booking.paymentStatus === 'paid' ? 'Paid' :
                   booking.paymentStatus === 'partial_refund' ? '50% Refunded' :
                   booking.paymentStatus === 'refunded' ? 'Refunded' : 'Pending'}
                </span>
              </div>

              {/* Refund info shown when cancelled */}
              {booking.status === 'cancelled' && booking.refundAmount > 0 && (
                <div className="refund-info-box">
                  <div className="refund-info-header">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    Refund Details
                  </div>
                  <div className="refund-row">
                    <span>Amount Paid</span>
                    <span>${booking.paidAmount || booking.totalPrice}</span>
                  </div>
                  <div className="refund-row">
                    <span>Refund (50%)</span>
                    <span className="refund-amount">${booking.refundAmount}</span>
                  </div>
                  <p className="refund-notice">Refund will be processed to your original payment method within 5–7 business days.</p>
                </div>
              )}

              {booking.status === 'cancelled' && (!booking.refundAmount || booking.refundAmount === 0) && (
                <div className="no-refund-box">
                  No refund applicable — payment was not completed before cancellation.
                </div>
              )}

              <div className="price-breakdown">
                <h4>Price Breakdown</h4>
                <div className="price-row">
                  <span>Base Tour Price</span>
                  <span>${Math.round(booking.totalPrice * 0.8)}</span>
                </div>
                {booking.extraServices?.transport && (
                  <div className="price-row">
                    <span>Private Transport</span>
                    <span>$100</span>
                  </div>
                )}
                {booking.extraServices?.meals && (
                  <div className="price-row">
                    <span>Full Board Meals</span>
                    <span>${30 * booking.participants * booking.duration}</span>
                  </div>
                )}
                <div className="price-row service-fee">
                  <span>Service Fee</span>
                  <span>${Math.round(booking.totalPrice * 0.15)}</span>
                </div>
                <div className="price-row total">
                  <span>Total</span>
                  <span>${booking.totalPrice}</span>
                </div>
              </div>

              {booking.specialRequests && (
                <div className="special-requests-section">
                  <h4>Special Requests</h4>
                  <p>{booking.specialRequests}</p>
                </div>
              )}

              <div className="action-buttons">
                <Link to="/tours" className="btn-secondary book-another-btn">
                  Book Another Tour
                </Link>
                {booking.status === 'pending' && (
                  <button 
                    className="btn-outline cancel-booking-btn"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to cancel this booking?')) {
                        // Add cancel logic here
                      }
                    }}
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>

            <div className="need-help-card">
              <h4>Need Help?</h4>
              <p>Contact our support team for any questions about your booking.</p>
              <Link to="/contact" className="contact-link">
                Contact Support →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailPage;