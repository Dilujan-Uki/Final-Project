// src/components/work/pages/MyBookingsPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyBookingsPage.css';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/bookings/my-bookings', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch bookings');
        }

        if (data.status === 'success') {
          setBookings(data.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to load bookings');
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'confirmed': return 'status-confirmed';
      case 'pending': return 'status-pending';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="loading-page">
        <div className="container">
          <div className="loading-spinner"></div>
          <p>Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-bookings-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">My Bookings</h1>
          <p className="page-subtitle">View and manage your tour bookings</p>
        </div>

        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        {bookings.length === 0 ? (
          <div className="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
            <h3>No Bookings Yet</h3>
            <p>You haven't made any tour bookings yet.</p>
            <button 
              onClick={() => navigate('/tours')} 
              className="btn-primary"
            >
              Browse Tours
            </button>
          </div>
        ) : (
          <div className="bookings-grid">
            {bookings.map((booking) => (
              <div key={booking._id} className="booking-card">
                <div className="booking-image">
                  <img 
                    src={booking.tour?.image || 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop'} 
                    alt={booking.tour?.name} 
                  />
                </div>
                <div className="booking-content">
                  <div className="booking-header">
                    <h3 className="booking-title">{booking.tour?.name}</h3>
                    <span className={`status-badge ${getStatusBadgeClass(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <div className="booking-details">
                    <div className="detail">
                      <span className="detail-label">Booking Date:</span>
                      <span className="detail-value">
                        {new Date(booking.bookingDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="detail">
                      <span className="detail-label">Participants:</span>
                      <span className="detail-value">{booking.participants} people</span>
                    </div>
                    <div className="detail">
                      <span className="detail-label">Duration:</span>
                      <span className="detail-value">{booking.duration} days</span>
                    </div>
                    <div className="detail">
                      <span className="detail-label">Total Price:</span>
                      <span className="detail-value price">${booking.totalPrice}</span>
                    </div>
                  </div>

                  {booking.specialRequests && (
                    <div className="special-requests">
                      <strong>Special Requests:</strong> {booking.specialRequests}
                    </div>
                  )}

                  <div className="booking-actions">
                    <button 
                      className="btn-secondary"
                      onClick={() => navigate(`/booking/${booking._id}`)}
                    >
                      View Details
                    </button>
                    <button 
                      className="btn-outline"
                      onClick={() => console.log('Cancel booking', booking._id)}
                      disabled={booking.status === 'cancelled' || booking.status === 'completed'}
                    >
                      {booking.status === 'cancelled' ? 'Cancelled' : 'Cancel'}
                    </button>
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