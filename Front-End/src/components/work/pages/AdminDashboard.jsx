// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0,
    totalUsers: 0
  });
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      const userData = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (!userData || !token) {
        navigate('/login');
        return;
      }

      try {
        const user = JSON.parse(userData);
        setUser(user);
        
        // Check if user is admin
        if (user.role !== 'admin') {
          navigate('/account');
          return;
        }

        setIsAdmin(true);
        fetchDashboardData(token);
      } catch (error) {
        console.error('Error checking admin:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [navigate]);

  const fetchDashboardData = async (token) => {
    try {
      // Fetch bookings
      const bookingsRes = await fetch('http://localhost:5000/api/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const bookingsData = await bookingsRes.json();
      if (bookingsData.status === 'success') {
        setBookings(bookingsData.data);
        
        // Calculate stats
        const pending = bookingsData.data.filter(b => b.status === 'pending').length;
        const revenue = bookingsData.data.reduce((sum, b) => sum + b.totalPrice, 0);
        
        setStats(prev => ({
          ...prev,
          totalBookings: bookingsData.data.length,
          pendingBookings: pending,
          totalRevenue: revenue
        }));
      }

      // Fetch pending reviews
      const reviewsRes = await fetch('http://localhost:5000/api/reviews?approved=false', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const reviewsData = await reviewsRes.json();
      if (reviewsData.status === 'success') {
        setReviews(reviewsData.data);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        // Update local state
        setBookings(prev => prev.map(booking => 
          booking._id === bookingId ? data.data : booking
        ));
        
        alert('Booking status updated successfully');
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Failed to update booking status');
    }
  };

  const handleApproveReview = async (reviewId, approve) => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`http://localhost:5000/api/reviews/${reviewId}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isApproved: approve })
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        // Remove from pending reviews
        setReviews(prev => prev.filter(review => review._id !== reviewId));
        alert(`Review ${approve ? 'approved' : 'rejected'} successfully`);
      }
    } catch (error) {
      console.error('Error updating review:', error);
      alert('Failed to update review');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="loading-page">
        <div className="container">
          <div className="loading-spinner"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        {/* Header */}
        <div className="admin-header">
          <h1 className="admin-title">Admin Dashboard</h1>
          <p className="admin-subtitle">Welcome back, Administrator!</p>
        </div>

        <div className="admin-content">
          {/* Sidebar */}
          <aside className="admin-sidebar">
            <div className="sidebar-profile">
              <div className="profile-avatar admin-avatar">
                <span className="avatar-icon">👑</span>
              </div>
              <div className="profile-info">
                <h3 className="profile-name">{user?.name}</h3>
                <p className="profile-role">Administrator</p>
                <p className="profile-email">{user?.email}</p>
              </div>
            </div>

            <nav className="sidebar-nav">
              <button 
                className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="9"></rect>
                  <rect x="14" y="3" width="7" height="5"></rect>
                  <rect x="3" y="15" width="7" height="6"></rect>
                  <rect x="14" y="13" width="7" height="8"></rect>
                </svg>
                Dashboard
              </button>
              
              <button 
                className={`nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
                onClick={() => setActiveTab('bookings')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
                Bookings
              </button>
              
              <button 
                className={`nav-item ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                Reviews
              </button>
              
              <button 
                className={`nav-item ${activeTab === 'tours' ? 'active' : ''}`}
                onClick={() => setActiveTab('tours')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                  <line x1="7" y1="7" x2="7.01" y2="7"></line>
                </svg>
                Tours
              </button>
              
              <button 
                className="nav-item logout-btn"
                onClick={() => navigate('/account')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                User Account
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="admin-main">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="dashboard-tab">
                {/* Stats Grid */}
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">📊</div>
                    <div className="stat-content">
                      <h3 className="stat-value">{stats.totalBookings}</h3>
                      <p className="stat-label">Total Bookings</p>
                    </div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-content">
                      <h3 className="stat-value">{stats.pendingBookings}</h3>
                      <p className="stat-label">Pending Bookings</p>
                    </div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon">💰</div>
                    <div className="stat-content">
                      <h3 className="stat-value">{formatCurrency(stats.totalRevenue)}</h3>
                      <p className="stat-label">Total Revenue</p>
                    </div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon">⭐</div>
                    <div className="stat-content">
                      <h3 className="stat-value">{reviews.length}</h3>
                      <p className="stat-label">Pending Reviews</p>
                    </div>
                  </div>
                </div>

                {/* Recent Bookings */}
                <div className="dashboard-card">
                  <div className="card-header">
                    <h3 className="card-title">Recent Bookings</h3>
                    <button 
                      className="view-all-link"
                      onClick={() => setActiveTab('bookings')}
                    >
                      View All →
                    </button>
                  </div>
                  
                  <div className="card-content">
                    {bookings.slice(0, 5).map((booking) => (
                      <div key={booking._id} className="booking-item">
                        <div className="booking-info">
                          <h4 className="booking-title">{booking.tour?.name}</h4>
                          <div className="booking-details">
                            <span className="booking-user">{booking.user?.name}</span>
                            <span className="booking-date">{formatDate(booking.createdAt)}</span>
                            <span className={`booking-status ${booking.status}`}>
                              {booking.status}
                            </span>
                          </div>
                        </div>
                        <div className="booking-amount">
                          {formatCurrency(booking.totalPrice)}
                        </div>
                      </div>
                    ))}
                    
                    {bookings.length === 0 && (
                      <div className="empty-state">
                        <p>No bookings yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="bookings-tab">
                <div className="tab-header">
                  <h3 className="tab-title">All Bookings</h3>
                  <div className="tab-actions">
                    <select className="filter-select">
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                
                <div className="bookings-table">
                  <div className="table-header">
                    <div className="table-col">Tour</div>
                    <div className="table-col">Customer</div>
                    <div className="table-col">Date</div>
                    <div className="table-col">Amount</div>
                    <div className="table-col">Status</div>
                    <div className="table-col">Actions</div>
                  </div>
                  
                  <div className="table-body">
                    {bookings.map((booking) => (
                      <div key={booking._id} className="table-row">
                        <div className="table-col">
                          <div className="tour-info">
                            <h4>{booking.tour?.name}</h4>
                            <p>{booking.participants} participants • {booking.duration} days</p>
                          </div>
                        </div>
                        <div className="table-col">
                          <p className="customer-name">{booking.user?.name}</p>
                          <p className="customer-email">{booking.user?.email}</p>
                        </div>
                        <div className="table-col">
                          <p>{formatDate(booking.bookingDate)}</p>
                        </div>
                        <div className="table-col">
                          <p className="booking-amount">{formatCurrency(booking.totalPrice)}</p>
                        </div>
                        <div className="table-col">
                          <span className={`status-badge ${booking.status}`}>
                            {booking.status}
                          </span>
                        </div>
                        <div className="table-col">
                          <div className="action-buttons">
                            <select 
                              className="status-select"
                              value={booking.status}
                              onChange={(e) => handleUpdateBookingStatus(booking._id, e.target.value)}
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            <button 
                              className="action-btn view-btn"
                              onClick={() => console.log('View booking', booking._id)}
                            >
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {bookings.length === 0 && (
                      <div className="empty-table">
                        <p>No bookings found</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="reviews-tab">
                <div className="tab-header">
                  <h3 className="tab-title">Pending Reviews</h3>
                </div>
                
                <div className="reviews-grid">
                  {reviews.map((review) => (
                    <div key={review._id} className="review-card">
                      <div className="review-header">
                        <div className="reviewer-info">
                          <h4 className="reviewer-name">{review.user?.name}</h4>
                          <div className="review-rating">
                            {'★'.repeat(review.rating)}
                            {'☆'.repeat(5 - review.rating)}
                          </div>
                        </div>
                        <div className="review-tour">
                          Tour: {review.tour}
                        </div>
                      </div>
                      
                      <div className="review-content">
                        <h3 className="review-title">{review.title}</h3>
                        <p className="review-comment">{review.comment}</p>
                      </div>
                      
                      <div className="review-actions">
                        <button 
                          className="btn-success"
                          onClick={() => handleApproveReview(review._id, true)}
                        >
                          Approve
                        </button>
                        <button 
                          className="btn-danger"
                          onClick={() => handleApproveReview(review._id, false)}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {reviews.length === 0 && (
                    <div className="empty-state">
                      <p>No pending reviews</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tours Tab */}
            {activeTab === 'tours' && (
              <div className="tours-tab">
                <div className="tab-header">
                  <h3 className="tab-title">Tour Management</h3>
                  <button className="btn-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Add New Tour
                  </button>
                </div>
                
                <div className="tours-grid">
                  <div className="info-card">
                    <h4>Tour Statistics</h4>
                    <p>Coming soon...</p>
                  </div>
                  
                  <div className="info-card">
                    <h4>Popular Tours</h4>
                    <p>Analytics dashboard will be implemented here</p>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;