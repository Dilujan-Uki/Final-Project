import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyBookingsPage.css';

const getTourImage = (tourName) => {
  const images = {
    'Cultural Triangle Explorer': 'https://images.unsplash.com/photo-1586816001966-79b736744398?w=400',
    'Hill Country Adventure': 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=400',
    'Wildlife Safari Experience': 'https://images.unsplash.com/photo-1580666756564-c39e3f33b2a1?w=400',
    'Coastal Paradise Tour': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
  };
  return images[tourName] || 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400';
};

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchBookings = async () => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    try {
      const response = await fetch('http://localhost:5000/api/new-bookings/my-bookings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch bookings');
      if (data.success) {
        // Filter out cancelled bookings from display
        const visible = data.data.filter(b => b.status !== 'cancelled');
        setBookings(visible);
      }
    } catch (err) {
      setError(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, [navigate]);

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
        // Immediately remove from UI
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

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'pending': return 'Booked';
      case 'confirmed': return 'Confirmed';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'confirmed': return 'status-confirmed';
      case 'pending': return 'status-pending';
      case 'completed': return 'status-completed';
      default: return '';
    }
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
              <div key={booking._id} className="booking-card">
                <div className="booking-image">
                  <img src={getTourImage(booking.tourName)} alt={booking.tourName} />
                </div>
                <div className="booking-content">
                  <div className="booking-header">
                    <h3 className="booking-title">{booking.tourName}</h3>
                    <span className={`status-badge ${getStatusClass(booking.status)}`}>
                      {getStatusDisplay(booking.status)}
                    </span>
                  </div>
                  <div className="booking-details">
                    <div className="detail"><span className="detail-label">Booking Date:</span><span className="detail-value">{new Date(booking.bookingDate).toLocaleDateString()}</span></div>
                    <div className="detail"><span className="detail-label">Participants:</span><span className="detail-value">{booking.participants} people</span></div>
                    <div className="detail"><span className="detail-label">Duration:</span><span className="detail-value">{booking.duration} days</span></div>
                    <div className="detail"><span className="detail-label">Total Price:</span><span className="detail-value price">${booking.totalPrice}</span></div>
                  </div>
                  {booking.specialRequests && (
                    <div className="special-requests"><strong>Special Requests:</strong> {booking.specialRequests}</div>
                  )}
                  <div className="booking-actions">
                    <button className="btn-secondary" onClick={() => navigate(`/booking-detail/${booking._id}`)}>View Details</button>
                    {booking.status !== 'completed' && (
                      <button className="btn-outline cancel" onClick={() => handleCancel(booking._id)}>Cancel</button>
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
