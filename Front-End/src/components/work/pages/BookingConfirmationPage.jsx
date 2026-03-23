import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './BookingConfirmationPage.css';

const BookingConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [confirmationData, setConfirmationData] = useState(null);
  const [animationDone, setAnimationDone] = useState(false);
  const checkRef = useRef(null);

  useEffect(() => {
    // Get confirmation data from navigation state
    if (location.state?.confirmationData) {
      setConfirmationData(location.state.confirmationData);
    } else {
      // Try to reconstruct from localStorage as fallback
      try {
        const lastBooking = localStorage.getItem('lastBookingDetails');
        if (lastBooking) {
          setConfirmationData(JSON.parse(lastBooking));
        } else {
          // No data at all — redirect home
          navigate('/');
        }
      } catch {
        navigate('/');
      }
    }

    // Trigger check animation after a short delay
    const timer = setTimeout(() => setAnimationDone(true), 600);
    return () => clearTimeout(timer);
  }, [location.state, navigate]);

  if (!confirmationData) {
    return (
      <div className="confirm-page">
        <div className="confirm-container">
          <div className="confirm-loading">
            <div className="confirm-spinner"></div>
            <p>Loading confirmation...</p>
          </div>
        </div>
      </div>
    );
  }

  const {
    bookingId,
    tourName,
    guideName,
    bookingDate,
    participants,
    duration,
    totalAmount,
    specialRequests,
  } = confirmationData;

  const formattedDate = bookingDate
    ? new Date(bookingDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'N/A';

  return (
    <div className="confirm-page">
      {/* Floating confetti particles */}
      <div className="confetti-wrap" aria-hidden="true">
        {Array.from({ length: 22 }).map((_, i) => (
          <span key={i} className={`confetti-piece cp-${(i % 6) + 1}`} style={{ '--i': i }} />
        ))}
      </div>

      <div className="confirm-container">

        {/* ── Progress Bar ── */}
        <div className="confirm-progress">
          <div className="progress-step completed">
            <span className="step-number">✓</span>
            <span className="step-label">Booking Details</span>
          </div>
          <div className="progress-connector filled" />
          <div className="progress-step completed">
            <span className="step-number">✓</span>
            <span className="step-label">Payment</span>
          </div>
          <div className="progress-connector filled" />
          <div className="progress-step active">
            <span className="step-number">3</span>
            <span className="step-label">Confirmation</span>
          </div>
        </div>

        {/* ── Hero Card ── */}
        <div className={`confirm-hero ${animationDone ? 'hero-visible' : ''}`}>
          <div className="hero-icon-wrap" ref={checkRef}>
            <svg className="hero-check" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle className="check-circle" cx="26" cy="26" r="24" stroke="#2d6a2d" strokeWidth="3" fill="none" />
              <polyline className="check-mark" points="14,27 22,35 38,18" stroke="#2d6a2d" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>
          <h1 className="hero-title">Booking Confirmed!</h1>
          <p className="hero-subtitle">
            Your Sri Lankan adventure is locked in. Get ready for an unforgettable experience!
          </p>
          {bookingId && (
            <div className="booking-ref">
              <span className="ref-label">Booking Reference</span>
              <span className="ref-value">#{bookingId}</span>
            </div>
          )}
        </div>

        {/* ── Details Grid ── */}
        <div className="confirm-grid">

          {/* Tour Info */}
          <div className="confirm-card">
            <div className="card-header">
              <span className="card-icon">🗺️</span>
              <h2 className="card-title">Tour Details</h2>
            </div>
            <div className="card-body">
              <div className="detail-row">
                <span className="detail-label">Tour</span>
                <span className="detail-value">{tourName}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Duration</span>
                <span className="detail-value">{duration} {duration === 1 ? 'day' : 'days'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Start Date</span>
                <span className="detail-value">{formattedDate}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Participants</span>
                <span className="detail-value">{participants} {participants === 1 ? 'person' : 'persons'}</span>
              </div>
            </div>
          </div>

          {/* Guide Info */}
          {guideName && (
            <div className="confirm-card">
              <div className="card-header">
                <span className="card-icon">🧭</span>
                <h2 className="card-title">Your Guide</h2>
              </div>
              <div className="card-body">
                <div className="detail-row">
                  <span className="detail-label">Guide Name</span>
                  <span className="detail-value">{guideName}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Status</span>
                  <span className="detail-value status-badge">Assigned ✓</span>
                </div>
                <p className="guide-note">Your guide will contact you 24 hours before the tour starts.</p>
              </div>
            </div>
          )}

          {/* Payment Summary */}
          <div className="confirm-card">
            <div className="card-header">
              <span className="card-icon">💳</span>
              <h2 className="card-title">Payment Summary</h2>
            </div>
            <div className="card-body">
              <div className="detail-row">
                <span className="detail-label">Status</span>
                <span className="detail-value payment-paid">Paid ✓</span>
              </div>
              <div className="detail-row total-row">
                <span className="detail-label">Total Paid</span>
                <span className="detail-value total-amount">${totalAmount}</span>
              </div>
              <p className="payment-note">A receipt has been recorded for your booking.</p>
            </div>
          </div>

          {/* Special Requests */}
          {specialRequests && (
            <div className="confirm-card">
              <div className="card-header">
                <span className="card-icon">📝</span>
                <h2 className="card-title">Special Requests</h2>
              </div>
              <div className="card-body">
                <p className="special-req-text">{specialRequests}</p>
              </div>
            </div>
          )}

        </div>

        {/* ── What's Next Banner ── */}
        <div className="whats-next">
          <h3 className="next-title">What Happens Next?</h3>
          <div className="next-steps">
            <div className="next-step">
              <div className="next-icon">📧</div>
              <div className="next-text">
                <strong>Booking Saved</strong>
                <p>Your booking details are saved in your account.</p>
              </div>
            </div>
            <div className="next-arrow">→</div>
            <div className="next-step">
              <div className="next-icon">📞</div>
              <div className="next-text">
                <strong>Guide Contact</strong>
                <p>Your assigned guide will reach out 24 hrs before.</p>
              </div>
            </div>
            <div className="next-arrow">→</div>
            <div className="next-step">
              <div className="next-icon">🌴</div>
              <div className="next-text">
                <strong>Enjoy Your Tour</strong>
                <p>Pack your bags and get ready for adventure!</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="confirm-actions">
          <button
            className="btn-primary"
            onClick={() => navigate('/my-bookings')}
          >
            📋 View My Bookings
          </button>
          <button
            className="btn-secondary"
            onClick={() => navigate('/tours')}
          >
            🔍 Explore More Tours
          </button>
          <button
            className="btn-ghost"
            onClick={() => navigate('/')}
          >
            🏠 Back to Home
          </button>
        </div>

      </div>
    </div>
  );
};

export default BookingConfirmationPage;