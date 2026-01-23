// src/components/work/pages/AccountPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './AccountPage.css';

const AccountPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
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
      fetchUserData(token, parsedUser._id);
      setLoading(false);
    } catch (error) {
      console.error('Error loading user data:', error);
      navigate('/login');
    }
  }, [navigate]);

  const fetchUserData = async (token, userId) => {
    try {
      // Fetch user bookings
      const bookingsRes = await fetch('http://localhost:5000/api/bookings/my-bookings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        if (bookingsData.status === 'success') {
          setBookings(bookingsData.data);
        }
      }

      // Fetch user reviews
      const reviewsRes = await fetch('http://localhost:5000/api/reviews/my-reviews', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (reviewsRes.ok) {
        const reviewsData = await reviewsRes.json();
        if (reviewsData.status === 'success') {
          setReviews(reviewsData.data);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
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

  const isAdmin = user?.role === 'admin';

  return (
    <div className="account-page">
      <div className="container">
        <div className="account-header">
          <h1 className="account-title">
            {isAdmin ? 'Administrator Dashboard' : 'My Account'}
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
                <span className="avatar-icon">
                  {isAdmin ? '👑' : user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="profile-info">
                <h3 className="profile-name">{user?.name}</h3>
                <p className="profile-email">{user?.email}</p>
                {isAdmin && (
                  <div className="role-badge">Administrator</div>
                )}
              </div>
            </div>

            <nav className="sidebar-nav">
              <button 
                className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Profile
              </button>
              
              <button 
                className={`nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
                onClick={() => setActiveTab('bookings')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                My Reviews
                {reviews.length > 0 && (
                  <span className="nav-badge">{reviews.length}</span>
                )}
              </button>
              
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className="nav-item admin-link"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="9"></rect>
                    <rect x="14" y="3" width="7" height="5"></rect>
                    <rect x="3" y="15" width="7" height="6"></rect>
                    <rect x="14" y="13" width="7" height="8"></rect>
                  </svg>
                  Admin Dashboard
                </Link>
              )}
              
              <button className="nav-item logout-btn" onClick={handleLogout}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
              <div className="account-card profile-card">
                <h2 className="card-title">Personal Information</h2>
                <div className="card-content">
                  <div className="info-grid">
                    <div className="info-item">
                      <label className="info-label">Full Name</label>
                      <p className="info-value">{user?.name}</p>
                    </div>
                    <div className="info-item">
                      <label className="info-label">Email Address</label>
                      <p className="info-value">{user?.email}</p>
                    </div>
                    <div className="info-item">
                      <label className="info-label">Phone Number</label>
                      <p className="info-value">{user?.phone || 'Not provided'}</p>
                    </div>
                    <div className="info-item">
                      <label className="info-label">Account Type</label>
                      <p className="info-value">
                        {isAdmin ? 'Administrator' : 'Standard User'}
                      </p>
                    </div>
                    <div className="info-item">
                      <label className="info-label">Member Since</label>
                      <p className="info-value">
                        {user?.createdAt 
                          ? new Date(user.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : 'Recently'}
                      </p>
                    </div>
                    {isAdmin && (
                      <div className="info-item full-width">
                        <label className="info-label">Administrator Privileges</label>
                        <div className="admin-permissions">
                          <span className="permission-tag">Manage Bookings</span>
                          <span className="permission-tag">Approve Reviews</span>
                          <span className="permission-tag">View Analytics</span>
                          <span className="permission-tag">User Management</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="profile-actions">
                    <button className="btn-primary">
                      Edit Profile
                    </button>
                    <button className="btn-secondary">
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="account-card bookings-card">
                <div className="card-header">
                  <h2 className="card-title">My Bookings</h2>
                  <Link to="/tours" className="view-all-link">
                    Book New Tour →
                  </Link>
                </div>
                <div className="card-content">
                  {bookings.length > 0 ? (
                    <div className="bookings-list">
                      {bookings.map((booking) => (
                        <div key={booking._id} className="booking-item">
                          <div className="booking-image">
                            <img 
                              src={booking.tour?.image || 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=300&h=200&fit=crop'} 
                              alt={booking.tour?.name} 
                            />
                          </div>
                          <div className="booking-info">
                            <h4 className="booking-title">{booking.tour?.name}</h4>
                            <div className="booking-meta">
                              <span className="booking-date">
                                {new Date(booking.bookingDate).toLocaleDateString()}
                              </span>
                              <span className="booking-participants">
                                {booking.participants} participants
                              </span>
                              <span className="booking-duration">
                                {booking.duration} days
                              </span>
                            </div>
                            <div className="booking-status-container">
                              <span className={`booking-status ${booking.status}`}>
                                {booking.status}
                              </span>
                              <span className="booking-price">
                                ${booking.totalPrice}
                              </span>
                            </div>
                          </div>
                          <div className="booking-actions">
                            <Link 
                              to={`/booking/${booking._id}`} 
                              className="btn-outline"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                      </svg>
                      <h3>No Bookings Yet</h3>
                      <p>You haven't made any tour bookings yet.</p>
                      <Link to="/tours" className="btn-primary">
                        Browse Tours
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="account-card reviews-card">
                <div className="card-header">
                  <h2 className="card-title">My Reviews</h2>
                  <Link to="/reviews" className="view-all-link">
                    Write New Review →
                  </Link>
                </div>
                <div className="card-content">
                  {reviews.length > 0 ? (
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
                          <h5 className="review-title">{review.title}</h5>
                          <p className="review-comment">{review.comment}</p>
                          <div className="review-footer">
                            <span className="review-date">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                            <span className={`review-status ${review.isApproved ? 'approved' : 'pending'}`}>
                              {review.isApproved ? 'Approved' : 'Pending Approval'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                      <h3>No Reviews Yet</h3>
                      <p>You haven't written any reviews yet.</p>
                      <Link to="/reviews" className="btn-primary">
                        Write a Review
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;