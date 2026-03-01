// src/components/work/pages/AccountPage.jsx - FIXED
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { newBookingsAPI } from '/home/uki-dsa-01/LESSONS/Final-Project/Front-End/src/services/api.js';
import './AccountPage.css';

const AccountPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!userData || !token) {
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setLoading(false);

      // Fetch user-specific data
      fetchUserBookings(token);
      fetchUserReviews(token);
    } catch (error) {
      console.error('Error loading user data:', error);
      navigate('/login');
    }
  }, [navigate]);

  const fetchUserBookings = async (token) => {
    setLoadingBookings(true);
    try {
      // Use the newBookingsAPI
      const response = await newBookingsAPI.getMyBookings();

      // The API already returns the data in the format we need
      console.log('User bookings:', response.data);
      setBookings(response.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  };
  
  const fetchUserReviews = async (token) => {
    setLoadingReviews(true);
    try {
      const response = await fetch('http://localhost:5000/api/reviews/my-reviews', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        console.log('User reviews:', data.data);
        setReviews(data.data || []);
      } else {
        console.error('Failed to fetch reviews:', data.message);
        setReviews([]);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('selectedTour');
    localStorage.removeItem('selectedGuide');
    navigate('/login');
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'confirmed': return 'confirmed';
      case 'pending': return 'pending';
      case 'completed': return 'completed';
      case 'cancelled': return 'cancelled';
      default: return '';
    }
  };

  // Add delete function
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:5000/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.status === 'success') {
        alert('✅ Review deleted successfully');
        // Refresh reviews list
        fetchUserReviews(token);
      } else {
        alert('Failed to delete review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Error deleting review');
    }
  };

  if (loading) {
    return (
      <div className="loading-page">
        <div className="container">
          <div className="loading-spinner"></div>
          <p>Loading your account...</p>
        </div>
      </div>
    );
  }

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  return (
    <div className="account-page">
      <div className="container">
        {/* Header */}
        <div className="account-header">
          <h1 className="account-title">
            {isAdmin ? 'Administrator Account' : 'My Account'}
          </h1>
          <p className="account-subtitle">
            Welcome back, {user?.name}!
            {isAdmin && <span className="admin-badge">Administrator</span>}
          </p>
        </div>

        <div className="account-content">
          {/* Sidebar Navigation */}
          <aside className="account-sidebar">
            <div className="sidebar-profile">
              <div className={`profile-avatar ${isAdmin ? 'admin-avatar' : ''}`}>
                {isAdmin ? '👑' : user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="profile-info">
                <h3 className="profile-name">{user?.name}</h3>
                <p className="profile-email">{user?.email}</p>
                <span className={`role-badge ${isAdmin ? 'admin' : ''}`}>
                  {isAdmin ? 'Administrator' : 'Member'}
                </span>
              </div>
            </div>

            <nav className="sidebar-nav">
              <button
                className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Profile
              </button>

              <button
                className={`nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
                onClick={() => setActiveTab('bookings')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
                My Bookings
                {bookings.length > 0 && (
                  <span className="nav-badge">{bookings.length}</span>
                )}
              </button>

              <button
                className={`nav-item ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                My Reviews
                {reviews.length > 0 && (
                  <span className="nav-badge">{reviews.length}</span>
                )}
              </button>

              {isAdmin && (
                <Link to="/admin" className="nav-item admin-link">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="9"></rect>
                    <rect x="14" y="3" width="7" height="5"></rect>
                    <rect x="3" y="15" width="7" height="6"></rect>
                    <rect x="14" y="13" width="7" height="8"></rect>
                  </svg>
                  Admin Dashboard
                </Link>
              )}

              <button className="nav-item logout-btn" onClick={handleLogout}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Logout
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="account-main">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="account-card">
                <div className="card-header">
                  <h2 className="card-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    Personal Information
                  </h2>
                </div>

                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Full Name</span>
                    <p className="info-value">{user?.name}</p>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Email Address</span>
                    <p className="info-value">{user?.email}</p>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Phone Number</span>
                    <p className="info-value">{user?.phone || 'Not provided'}</p>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Account Type</span>
                    <p className="info-value">{isAdmin ? 'Administrator' : 'Standard User'}</p>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Member Since</span>
                    <p className="info-value">
                      {user?.createdAt ? formatDate(user.createdAt) : 'Recently'}
                    </p>
                  </div>
                </div>

                {/* Account Stats */}
                <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                  <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(30, 76, 36, 0.05)', borderRadius: '12px' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e4c24' }}>{bookings.length}</div>
                    <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>Total Bookings</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(30, 76, 36, 0.05)', borderRadius: '12px' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e4c24' }}>{reviews.length}</div>
                    <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>Reviews Written</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(30, 76, 36, 0.05)', borderRadius: '12px' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e4c24' }}>
                      {bookings.filter(b => b.status === 'completed').length}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>Tours Completed</div>
                  </div>
                </div>
              </div>
            )}

            {/* My Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="account-card">
                <div className="card-header">
                  <h2 className="card-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    </svg>
                    My Bookings
                  </h2>
                  <Link to="/tours" className="view-all-link">
                    Book New Tour →
                  </Link>
                </div>

                {loadingBookings ? (
                  <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <div className="loading-spinner" style={{ margin: '0 auto 1rem' }}></div>
                    <p>Loading your bookings...</p>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <h3>No Bookings Yet</h3>
                    <p>You haven't booked any tours yet. Start your Sri Lankan adventure today!</p>
                    <Link to="/tours" className="btn-primary">Browse Tours</Link>
                  </div>
                ) : (
                  <div className="bookings-list">
                    {bookings.map((booking) => (
                      <div key={booking._id} className="booking-item">
                        <div className="booking-image">
                          <img
                            src={booking.tour?.image || 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=300&h=200&fit=crop'}
                            alt={booking.tour?.name || 'Tour'}
                          />
                        </div>
                        <div className="booking-info">
                          <h4 className="booking-title">{booking.tour?.name || 'Tour Package'}</h4>
                          <div className="booking-meta">
                            <span className="booking-date">
                              📅 {formatDate(booking.bookingDate)}
                            </span>
                            <span className="booking-participants">
                              👥 {booking.participants} {booking.participants === 1 ? 'person' : 'people'}
                            </span>
                            <span className="booking-duration">
                              ⏱️ {booking.duration} {booking.duration === 1 ? 'day' : 'days'}
                            </span>
                          </div>

                          {booking.guide && (
                            <div style={{ marginBottom: '0.5rem', fontSize: '0.85rem', color: '#ff8c42' }}>
                              👤 Guide: {booking.guide}
                            </div>
                          )}

                          {booking.specialRequests && (
                            <div style={{
                              marginBottom: '0.75rem',
                              padding: '0.5rem',
                              background: '#fff8e7',
                              borderRadius: '8px',
                              fontSize: '0.85rem',
                              borderLeft: '3px solid #ffb400'
                            }}>
                              <strong>Special Requests:</strong> {booking.specialRequests}
                            </div>
                          )}

                          <div className="booking-status-container">
                            <span className={`booking-status ${getStatusBadgeClass(booking.status)}`}>
                              {booking.status}
                            </span>
                            <span className="booking-price">${booking.totalPrice}</span>
                          </div>
                        </div>
                        <div className="booking-actions">
                          <Link to={`/booking/${booking._id}`} className="btn-outline">
                            View Details
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* My Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="account-card">
                <div className="card-header">
                  <h2 className="card-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    My Reviews
                  </h2>
                  <Link to="/reviews" className="view-all-link">
                    Write New Review →
                  </Link>
                </div>

                {loadingReviews ? (
                  <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <div className="loading-spinner" style={{ margin: '0 auto 1rem' }}></div>
                    <p>Loading your reviews...</p>
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <h3>No Reviews Yet</h3>
                    <p>You haven't written any reviews. Share your experience with other travelers!</p>
                    <Link to="/reviews" className="btn-primary">Write a Review</Link>
                  </div>
                ) : (
                  <div className="reviews-list">
                    {reviews.map((review) => (
                      <div key={review._id} className="review-item">
                        <div className="review-header">
                          <h4 className="review-tour">{review.tour}</h4>
                          <div className="review-rating">
                            {'★'.repeat(review.rating)}
                            {'☆'.repeat(5 - review.rating)}
                          </div>
                        </div>

                        {review.guide && (
                          <div style={{ fontSize: '0.8rem', color: '#ff8c42', marginBottom: '0.5rem' }}>
                            👤 Guide: {review.guide}
                          </div>
                        )}

                        <h5 className="review-title">{review.title}</h5>
                        <p className="review-comment">{review.comment}</p>

                        <div className="review-footer">
                          <span className="review-date">
                            📅 {formatDate(review.createdAt)}
                          </span>
                          <span className={`review-status ${review.isApproved ? 'approved' : 'pending'}`}>
                            {review.isApproved ? '✓ Approved' : '⏳ Pending Approval'}
                          </span>
                        </div>
                        
                        <div className="review-actions" style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                          <button
                            onClick={() => handleDeleteReview(review._id)}
                            className="btn-outline cancel"
                            style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;