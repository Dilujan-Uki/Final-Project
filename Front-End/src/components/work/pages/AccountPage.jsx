import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { newBookingsAPI } from '../../../services/api.js';
import { getTourImage } from '../../../utils/tourImageMapping';
import './AccountPage.css';

// Badge helpers 
const getSeenKey = (tab, userId) => `ceylon_seen_${tab}_${userId}`;

/** Count items created within last 24 h AND after the last-seen timestamp */
const countNewItems = (items, lastSeenTs) => {
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;
  return items.filter(item => {
    const created = new Date(item.createdAt).getTime();
    return (now - created) < oneDayMs && created > lastSeenTs;
  }).length;
};

/** Read the stored last-seen timestamp (0 if never) */
const getLastSeen = (tab, userId) => {
  try {
    return parseInt(localStorage.getItem(getSeenKey(tab, userId)) || '0', 10);
  } catch { return 0; }
};

/** Write current time as last-seen */
const markSeen = (tab, userId) => {
  try {
    localStorage.setItem(getSeenKey(tab, userId), String(Date.now()));
  } catch {}
};
// ─────────────────────────────────────────────────────────────────────────────

const AccountPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    preferences: { tourTypes: [], language: 'English' }
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState('');

  // Badge counts (new items within 24 h that the user hasn't seen yet)
  const [newBookingsCount, setNewBookingsCount] = useState(0);
  const [newReviewsCount, setNewReviewsCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!userData || !token) { navigate('/login'); return; }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setEditForm({
        name: parsedUser.name || '',
        email: parsedUser.email || '',
        phone: parsedUser.phone || '',
        address: parsedUser.address || '',
        preferences: parsedUser.preferences || { tourTypes: [], language: 'English' }
      });
      setLoading(false);
      fetchUserBookings(token, parsedUser._id || parsedUser.id);
      fetchUserReviews(token, parsedUser._id || parsedUser.id);
    } catch (error) {
      console.error('Error loading user data:', error);
      navigate('/login');
    }
  }, [navigate]);

  // Recalculate badges whenever data or tab changes
  useEffect(() => {
    if (!user) return;
    const uid = user._id || user.id;

    if (activeTab === 'bookings') {
      // User is looking at bookings → mark as seen, clear badge
      markSeen('bookings', uid);
      setNewBookingsCount(0);
    } else {
      setNewBookingsCount(countNewItems(bookings, getLastSeen('bookings', uid)));
    }

    if (activeTab === 'reviews') {
      markSeen('reviews', uid);
      setNewReviewsCount(0);
    } else {
      setNewReviewsCount(countNewItems(reviews, getLastSeen('reviews', uid)));
    }
  }, [activeTab, bookings, reviews, user]);

  const fetchUserBookings = async (token, userId) => {
    setLoadingBookings(true);
    try {
      const response = await newBookingsAPI.getMyBookings();
      const visible = (response.data || []).filter(b => b.status !== 'cancelled');
      setBookings(visible);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
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
        if (data.data?.refundMessage) alert(`Booking cancelled.\n\n${data.data.refundMessage}`);
      } else {
        alert(data.message || 'Failed to cancel booking');
      }
    } catch {
      alert('Error cancelling booking');
    }
  };

  const fetchUserReviews = async (token, userId) => {
    setLoadingReviews(true);
    try {
      const response = await fetch('http://localhost:5000/api/reviews/my-reviews', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok && data.status === 'success') {
        setReviews(data.data || []);
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePreferenceChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === 'tourTypes') {
      setEditForm(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          tourTypes: checked
            ? [...prev.preferences.tourTypes, value]
            : prev.preferences.tourTypes.filter(t => t !== value)
        }
      }));
    } else if (name === 'language') {
      setEditForm(prev => ({ ...prev, preferences: { ...prev.preferences, language: value } }));
    }
  };

  const handleUpdateProfile = async () => {
    const token = localStorage.getItem('token');
    setUpdateError('');
    setUpdateSuccess(false);
    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          name: editForm.name,
          phone: editForm.phone,
          address: editForm.address,
          preferences: editForm.preferences
        })
      });
      const data = await response.json();
      if (data.status === 'success') {
        const updatedUser = { ...user, ...data.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setUpdateSuccess(true);
        setIsEditing(false);
        setTimeout(() => setUpdateSuccess(false), 3000);
      } else {
        setUpdateError(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update error:', error);
      setUpdateError('Network error. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('selectedTour');
    localStorage.removeItem('selectedGuide');
    navigate('/login');
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.status === 'success') {
        alert('Review deleted successfully');
        fetchUserReviews(token, user._id || user.id);
      } else {
        alert('Failed to delete review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Error deleting review');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const tourTypeOptions = ['Cultural', 'Adventure', 'Wildlife', 'Beach', 'Hill Country', 'Food & Cuisine'];

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
        {/* Header */}
        <div className="account-header">
          <h1 className="account-title">My Account</h1>
          <p className="account-subtitle">Welcome back, {user?.name?.split(' ')[0]}!</p>
        </div>

        <div className="account-content">
          {/* Sidebar Navigation */}
          <aside className="account-sidebar">
            <div className="sidebar-profile">
              <div className="profile-avatar">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="profile-info">
                <h3 className="profile-name">{user?.name}</h3>
                <p className="profile-email">{user?.email}</p>
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
                {newBookingsCount > 0 && (
                  <span className="nav-badge nav-badge--new">{newBookingsCount}</span>
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
                {newReviewsCount > 0 && (
                  <span className="nav-badge nav-badge--new">{newReviewsCount}</span>
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

            {/* ── Profile Tab ── */}
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
                  {!isEditing && (
                    <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path>
                        <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon>
                      </svg>
                      Edit Profile
                    </button>
                  )}
                </div>

                {updateSuccess && <div className="success-message">✅ Profile updated successfully!</div>}
                {updateError && <div className="error-message">❌ {updateError}</div>}

                {isEditing ? (
                  <div className="edit-profile-form">
                    <div className="form-group">
                      <label htmlFor="name">Full Name</label>
                      <input type="text" id="name" name="name" value={editForm.name} onChange={handleInputChange} className="form-input" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <input type="email" id="email" name="email" value={editForm.email} disabled className="form-input disabled" />
                      <small className="field-note">Email cannot be changed</small>
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number</label>
                      <input type="tel" id="phone" name="phone" value={editForm.phone} onChange={handleInputChange} className="form-input" placeholder="Enter your phone number" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="address">Address</label>
                      <input type="text" id="address" name="address" value={editForm.address} onChange={handleInputChange} className="form-input" placeholder="Enter your address" />
                    </div>
                    <div className="form-group">
                      <label>Preferred Language</label>
                      <select name="language" value={editForm.preferences.language} onChange={handlePreferenceChange} className="form-select">
                        <option value="English">English</option>
                        <option value="Sinhala">Sinhala</option>
                        <option value="Tamil">Tamil</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Interested Tour Types</label>
                      <div className="checkbox-group">
                        {tourTypeOptions.map(type => (
                          <label key={type} className="checkbox">
                            <input type="checkbox" name="tourTypes" value={type} checked={editForm.preferences.tourTypes.includes(type)} onChange={handlePreferenceChange} />
                            {type}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="form-actions">
                      <button className="btn-primary save-btn" onClick={handleUpdateProfile}>Save Changes</button>
                      <button className="btn-outline cancel-btn" onClick={() => {
                        setIsEditing(false);
                        setEditForm({
                          name: user.name || '', email: user.email || '', phone: user.phone || '',
                          address: user.address || '',
                          preferences: user.preferences || { tourTypes: [], language: 'English' }
                        });
                      }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="info-grid">
                    <div className="info-item"><span className="info-label">Full Name</span><p className="info-value">{user?.name}</p></div>
                    <div className="info-item"><span className="info-label">Email Address</span><p className="info-value">{user?.email}</p></div>
                    <div className="info-item"><span className="info-label">Phone Number</span><p className="info-value">{user?.phone || 'Not provided'}</p></div>
                    <div className="info-item"><span className="info-label">Address</span><p className="info-value">{user?.address || 'Not provided'}</p></div>
                    <div className="info-item"><span className="info-label">Preferred Language</span><p className="info-value">{user?.preferences?.language || 'English'}</p></div>
                    <div className="info-item">
                      <span className="info-label">Interested In</span>
                      <p className="info-value">{user?.preferences?.tourTypes?.length > 0 ? user.preferences.tourTypes.join(', ') : 'All tours'}</p>
                    </div>
                  </div>
                )}

                <div className="quick-stats">
                  <div className="stat-item">
                    <span className="stat-number">{bookings.length}</span>
                    <span className="stat-label">Total Bookings</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{reviews.length}</span>
                    <span className="stat-label">Reviews</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{bookings.filter(b => b.status === 'completed').length}</span>
                    <span className="stat-label">Tours Completed</span>
                  </div>
                </div>
              </div>
            )}

            {/* ── My Bookings Tab ── */}
            {activeTab === 'bookings' && (
              <div className="account-card">
                <div className="card-header">
                  <h2 className="card-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    </svg>
                    My Bookings
                  </h2>
                  <Link to="/tours" className="view-all-link">Book New Tour</Link>
                </div>

                {loadingBookings ? (
                  <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading your bookings...</p>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <h3>No Bookings Yet</h3>
                    <p>Start your Sri Lankan adventure today!</p>
                    <Link to="/tours" className="btn-primary">Browse Tours</Link>
                  </div>
                ) : (
                  <div className="bookings-grid">
                    {bookings.map((booking) => {
                      const tourImage = getTourImage({ name: booking.tourName });
                      // Highlight cards created within last 24 h
                      const isNew = (Date.now() - new Date(booking.createdAt).getTime()) < 24 * 60 * 60 * 1000;
                      return (
                        <div key={booking._id} className={`booking-card${isNew ? ' booking-card--new' : ''}`}>
                          <div className="booking-image">
                            <img src={tourImage} alt={booking.tourName} />
                            <div className={`booking-status-badge ${booking.status}`}>
                              {booking.status === 'confirmed' ? 'Booked' : booking.status}
                            </div>
                            {isNew && <span className="new-pill">New</span>}
                          </div>
                          <div className="booking-card-content">
                            <h3 className="booking-tour-name">{booking.tourName}</h3>
                            <div className="booking-meta">
                              <div className="meta-item"><span className="meta-icon">📅</span><span>{formatDate(booking.bookingDate)}</span></div>
                              <div className="meta-item"><span className="meta-icon">👥</span><span>{booking.participants} {booking.participants === 1 ? 'person' : 'people'}</span></div>
                              <div className="meta-item"><span className="meta-icon">⏱️</span><span>{booking.duration} days</span></div>
                            </div>
                            {booking.guideName && (
                              <div className="booking-guide">
                                <span className="guide-icon">👤</span>
                                <span>Guide: {booking.guideName}</span>
                              </div>
                            )}
                            <div className="booking-price">
                              <span className="price-label">Total:</span>
                              <span className="price-value">${booking.totalPrice}</span>
                            </div>
                            {booking.specialRequests && (
                              <div className="booking-requests">
                                <span className="requests-label">Special Requests:</span>
                                <p>{booking.specialRequests}</p>
                              </div>
                            )}
                            <div className="booking-card-actions">
                              <Link to={`/booking-detail/${booking._id}`} className="btn-secondary view-details-btn">View Details</Link>
                              {booking.status !== 'completed' && (
                                <button className="btn-outline cancel-booking-btn" onClick={() => handleCancelBooking(booking._id)}>Cancel</button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── My Reviews Tab ── */}
            {activeTab === 'reviews' && (
              <div className="account-card">
                <div className="card-header">
                  <h2 className="card-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    My Reviews
                  </h2>
                  <Link to="/reviews" className="view-all-link">Write New Review</Link>
                </div>

                {loadingReviews ? (
                  <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading your reviews...</p>
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <h3>No Reviews Yet</h3>
                    <p>Share your experience with other travelers!</p>
                    <Link to="/reviews" className="btn-primary">Write a Review</Link>
                  </div>
                ) : (
                  <div className="reviews-list">
                    {reviews.map((review) => {
                      const isNew = (Date.now() - new Date(review.createdAt).getTime()) < 24 * 60 * 60 * 1000;
                      return (
                        <div key={review._id} className={`review-item${isNew ? ' review-item--new' : ''}`}>
                          {isNew && <span className="new-pill">New</span>}
                          <div className="review-header">
                            <div>
                              <h4 className="review-tour">{review.tour}</h4>
                              {review.guide && <div className="review-guide">Guide: {review.guide}</div>}
                            </div>
                            <div className="review-rating-display">
                              {[1, 2, 3, 4, 5].map(star => (
                                <span key={star} className={star <= review.rating ? 'star filled' : 'star'}>★</span>
                              ))}
                            </div>
                          </div>
                          <h5 className="review-title">{review.title}</h5>
                          <p className="review-comment">{review.comment}</p>
                          <div className="review-footer">
                            <span className="review-date">📅 {formatDate(review.createdAt)}</span>
                            <span className={`review-status ${review.isApproved ? 'approved' : 'pending'}`}>
                              {review.isApproved ? 'Approved' : 'Pending Approval'}
                            </span>
                          </div>
                          <div className="review-actions">
                            <button onClick={() => handleDeleteReview(review._id)} className="btn-outline delete-review-btn">Delete</button>
                          </div>
                        </div>
                      );
                    })}
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