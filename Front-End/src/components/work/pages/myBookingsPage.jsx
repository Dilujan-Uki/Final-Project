import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Cultural from '../assets/Cultural-Triangle.png';
import Hill from '../assets/Hill-Country.png';
import Safari from '../assets/Wild-Safari.png';
import Coastal from '../assets/Coastal-Paradise.png';  
import Complete from '../assets/Complete-Experience.png';
import Tea from '../assets/Tea-Plantation.png';

import './MyBookingsPage.css';

const getTourImage = (tourName) => {
  const images = {
    'Cultural Triangle Explorer': Cultural,
    'Hill Country Adventure': Hill,
    'Wildlife Safari Experience': Safari,
    'Coastal Paradise Tour': Coastal,
    'Complete Sri Lanka Experience': Complete,
    'Tea Country Journey': Tea
  };
  return images[tourName];
};

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchBookings = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    try {
      const response = await fetch('http://localhost:5000/api/new-bookings/my-bookings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch bookings');
      if (data.success) {
        const visible = data.data.filter(b => b.status !== 'cancelled');
        setBookings(visible);
      }
    } catch (err) {
      setError(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?\n\nNote: A 50% refund will be issued if payment was completed.')) return;
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/new-bookings/${bookingId}/cancel`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setBookings(prev => prev.filter(b => b._id !== bookingId));
        if (data.data?.refundMessage) {
          alert(`Booking cancelled.\n\n${data.data.refundMessage}`);
        }
      } else {
        alert(data.message || 'Failed to cancel booking');
      }
    } catch (err) {
      alert('Error cancelling booking');
    }
  };

  const getStatusDisplay = (booking) => {
    // Guide rejected — show a clear warning
    if (booking.guideName && booking.guideRequestStatus === 'rejected') {
      return 'Guide Declined';
    }
    // Guide request still pending
    if (booking.guideName && booking.guideRequestStatus === 'pending' && booking.status === 'pending') {
      return 'Awaiting Guide';
    }
    switch (booking.status) {
      case 'pending': return 'Booked';
      case 'confirmed': return 'Confirmed';
      case 'completed': return 'Completed';
      default: return booking.status;
    }
  };

  const getStatusClass = (booking) => {
    if (booking.guideName && booking.guideRequestStatus === 'rejected') return 'status-rejected';
    if (booking.guideName && booking.guideRequestStatus === 'pending' && booking.status === 'pending') return 'status-awaiting';
    switch (booking.status) {
      case 'confirmed': return 'status-confirmed';
      case 'pending': return 'status-pending';
      case 'completed': return 'status-completed';
      default: return '';
    }
  };

  // Render a notice banner below the booking card header when guide rejected
  const renderGuideNotice = (booking) => {
    if (!booking.guideName) return null;

    if (booking.guideRequestStatus === 'rejected') {
      return (
        <div className="guide-notice guide-notice--rejected">
          <span>⚠️</span>
          <div>
            <strong>Your tour guide has declined this booking.</strong>
            {booking.guideRejectionReason && (
              <p>Reason: {booking.guideRejectionReason}</p>
            )}
            <p>Please <button className="link-btn" onClick={() => navigate('/tour-guides')}>choose another guide</button> to proceed.</p>
          </div>
        </div>
      );
    }

    if (booking.guideRequestStatus === 'pending' && booking.status === 'pending') {
      return (
        <div className="guide-notice guide-notice--pending">
          <span>⏳</span>
          <div>
            <strong>Waiting for {booking.guideName} to accept your request.</strong>
            <p>You'll be able to proceed to payment once the guide accepts.</p>
          </div>
        </div>
      );
    }

    if (booking.guideRequestStatus === 'accepted') {
      return (
        <div className="guide-notice guide-notice--accepted">
          <span>✅</span>
          <strong>{booking.guideName} has accepted your booking!</strong>
        </div>
      );
    }

    return null;
  };

  if (loading) return (
    <div className="loading-page">
      <div className="container">
        <div className="loading-spinner"></div>
        <p>Loading your bookings...</p>
      </div>
    </div>
  );

  return (
    <div className="my-bookings-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">My Bookings</h1>
          <p className="page-subtitle">View and manage your tour bookings</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {bookings.length === 0 ? (
          <div className="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
            <h3>No Active Bookings</h3>
            <p>You have no active tour bookings at the moment.</p>
            <button onClick={() => navigate('/tours')} className="btn-primary">Browse Tours</button>
          </div>
        ) : (
          <div className="bookings-grid">
            {bookings.map((booking) => (
              <div key={booking._id} className={`booking-card ${booking.guideRequestStatus === 'rejected' ? 'booking-card--alert' : ''}`}>
                <div className="booking-image">
                  <img src={getTourImage(booking.tourName)} alt={booking.tourName} />
                </div>
                <div className="booking-content">
                  <div className="booking-header">
                    <h3 className="booking-title">{booking.tourName}</h3>
                    <span className={`status-badge ${getStatusClass(booking)}`}>
                      {getStatusDisplay(booking)}
                    </span>
                  </div>

                  {/* Guide request notice */}
                  {renderGuideNotice(booking)}

                  <div className="booking-details">
                    <div className="detail"><span className="detail-label">Booking Date:</span><span className="detail-value">{new Date(booking.bookingDate).toLocaleDateString()}</span></div>
                    <div className="detail"><span className="detail-label">Participants:</span><span className="detail-value">{booking.participants} people</span></div>
                    <div className="detail"><span className="detail-label">Duration:</span><span className="detail-value">{booking.duration} days</span></div>
                    <div className="detail"><span className="detail-label">Total Price:</span><span className="detail-value price">${booking.totalPrice}</span></div>
                    {booking.guideName && (
                      <div className="detail"><span className="detail-label">Guide:</span><span className="detail-value">{booking.guideName}</span></div>
                    )}
                  </div>

                  {booking.specialRequests && (
                    <div className="special-requests"><strong>Special Requests:</strong> {booking.specialRequests}</div>
                  )}

                  <div className="booking-actions">
                    <button className="btn-secondary" onClick={() => navigate(`/booking-detail/${booking._id}`)}>View Details</button>
                    {booking.status !== 'completed' && booking.guideRequestStatus !== 'rejected' && (
                      <button className="btn-outline cancel" onClick={() => handleCancel(booking._id)}>Cancel</button>
                    )}
                    {booking.guideRequestStatus === 'rejected' && (
                      <button className="btn-primary" onClick={() => navigate('/tour-guides')}>Choose Another Guide</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;