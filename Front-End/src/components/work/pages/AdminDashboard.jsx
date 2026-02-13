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
    totalUsers: 0,
    activeTours: 0,
    pendingReviews: 0
  });
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
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
      // Fetch all bookings
      const bookingsRes = await fetch('http://localhost:5000/api/bookings/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        
        if (bookingsData.status === 'success') {
          setBookings(bookingsData.data);
          
          const pending = bookingsData.data.filter(b => b.status === 'pending').length;
          const revenue = bookingsData.data.reduce((sum, b) => sum + b.totalPrice, 0);
          const active = bookingsData.data.filter(b => 
            b.status === 'confirmed' || b.status === 'pending'
          ).length;
          
          setStats(prev => ({
            ...prev,
            totalBookings: bookingsData.data.length,
            pendingBookings: pending,
            totalRevenue: revenue,
            activeTours: active
          }));
        }
      }

      // Fetch pending reviews
      const reviewsRes = await fetch('http://localhost:5000/api/reviews/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (reviewsRes.ok) {
        const reviewsData = await reviewsRes.json();
        
        if (reviewsData.status === 'success') {
          const pendingReviews = reviewsData.data.filter(r => !r.isApproved);
          setReviews(pendingReviews);
          setStats(prev => ({
            ...prev,
            pendingReviews: pendingReviews.length
          }));
        }
      }

      // Fetch users
      try {
        const usersRes = await fetch('http://localhost:5000/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          if (usersData.status === 'success') {
            setUsers(usersData.data);
            setStats(prev => ({
              ...prev,
              totalUsers: usersData.data.length
            }));
          }
        }
      } catch (error) {
        console.log('Users API not available, skipping');
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
        setBookings(prev => prev.map(booking => 
          booking._id === bookingId ? data.data : booking
        ));
        
        const pendingCount = bookings.filter(b => b.status === 'pending').length;
        setStats(prev => ({
          ...prev,
          pendingBookings: newStatus === 'pending' ? pendingCount + 1 : pendingCount - 1
        }));
      }
    } catch (error) {
      console.error('Error updating booking:', error);
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
        setReviews(prev => prev.filter(review => review._id !== reviewId));
        setStats(prev => ({
          ...prev,
          pendingReviews: prev.pendingReviews - 1
        }));
      }
    } catch (error) {
      console.error('Error updating review:', error);
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
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.tour?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="container">
          <div className="loading-page">
            <div className="loading-spinner"></div>
            <p>Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        {/* Header */}
        <div className="admin-header">
          <div className="admin-header-content">
            <h1 className="admin-title">
              Welcome back, <span>{user?.name?.split(' ')[0]}</span>
            </h1>
            <p className="admin-subtitle">
              <span className="admin-badge">Administrator</span>
              <span className="admin-date">{getCurrentDate()}</span>
            </p>
          </div>
        </div>

        <div className="admin-content">
          {/* Sidebar */}
          <aside className="admin-sidebar">
            <div className="sidebar-profile">
              <div className="profile-avatar admin-avatar">
                <span>👑</span>
              </div>
              <div className="profile-info">
                <h3 className="profile-name">{user?.name}</h3>
                <span className="profile-role">Administrator</span>
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
                All Bookings
                <span className="nav-badge">{bookings.length}</span>
              </button>
              
              <button 
                className={`nav-item ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                Pending Reviews
                <span className="nav-badge">{reviews.length}</span>
              </button>
              
              <button 
                className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => setActiveTab('users')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                Users
                <span className="nav-badge">{users.length}</span>
              </button>
              
              <button 
                className="nav-item"
                onClick={() => navigate('/account')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                My Account
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
                      <div className="stat-trend trend-up">
                        <span>↑ 12%</span> vs last month
                      </div>
                    </div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-content">
                      <h3 className="stat-value">{stats.pendingBookings}</h3>
                      <p className="stat-label">Pending Bookings</p>
                      <div className="stat-trend">
                        <span>Need attention</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon">💰</div>
                    <div className="stat-content">
                      <h3 className="stat-value">{formatCurrency(stats.totalRevenue)}</h3>
                      <p className="stat-label">Total Revenue</p>
                      <div className="stat-trend trend-up">
                        <span>↑ 8%</span> vs last month
                      </div>
                    </div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-content">
                      <h3 className="stat-value">{stats.totalUsers}</h3>
                      <p className="stat-label">Total Users</p>
                      <div className="stat-trend trend-up">
                        <span>↑ 15%</span> vs last month
                      </div>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">🎫</div>
                    <div className="stat-content">
                      <h3 className="stat-value">{stats.activeTours}</h3>
                      <p className="stat-label">Active Tours</p>
                      <div className="stat-trend">
                        <span>Currently running</span>
                      </div>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">⭐</div>
                    <div className="stat-content">
                      <h3 className="stat-value">{stats.pendingReviews}</h3>
                      <p className="stat-label">Pending Reviews</p>
                      <div className="stat-trend">
                        <span>Awaiting moderation</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="dashboard-card">
                  <div className="card-header">
                    <h3 className="card-title">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      Quick Actions
                    </h3>
                  </div>
                  <div className="quick-actions">
                    <button className="quick-action-btn" onClick={() => setActiveTab('bookings')}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                      </svg>
                      Manage Bookings
                    </button>
                    <button className="quick-action-btn" onClick={() => setActiveTab('reviews')}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                      Moderate Reviews
                    </button>
                    <button className="quick-action-btn">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="19" x2="12" y2="5"></line>
                        <polyline points="5 12 12 5 19 12"></polyline>
                      </svg>
                      Export Reports
                    </button>
                    <button className="quick-action-btn">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H5.78a1.65 1.65 0 0 0-1.51 1 1.65 1.65 0 0 0 .33 1.82l.06.06A10 10 0 0 0 12 17.66a10 10 0 0 0 6.28-2.6l.06-.06z"></path>
                      </svg>
                      Settings
                    </button>
                  </div>
                </div>

                {/* Recent Bookings */}
                <div className="dashboard-card">
                  <div className="card-header">
                    <h3 className="card-title">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      Recent Bookings
                    </h3>
                    <button 
                      className="view-all-link"
                      onClick={() => setActiveTab('bookings')}
                    >
                      View All
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </button>
                  </div>
                  
                  <div className="bookings-table">
                    <div className="table-header">
                      <div>Tour & Details</div>
                      <div>Customer</div>
                      <div>Booking Date</div>
                      <div>Amount</div>
                      <div>Status</div>
                      <div>Actions</div>
                    </div>
                    
                    <div className="table-body">
                      {bookings.slice(0, 5).map((booking) => (
                        <div key={booking._id} className="table-row">
                          <div className="table-col" data-label="Tour">
                            <div className="tour-info">
                              <h4>{booking.tour?.name || 'N/A'}</h4>
                              <p>👥 {booking.participants} participants • ⏱️ {booking.duration} days</p>
                              {booking.bookingDate && (
                                <p>📅 Tour: {formatDate(booking.bookingDate)}</p>
                              )}
                            </div>
                          </div>
                          <div className="table-col" data-label="Customer">
                            <p className="customer-name">{booking.user?.name || 'N/A'}</p>
                            <p className="customer-email">{booking.user?.email || 'N/A'}</p>
                          </div>
                          <div className="table-col" data-label="Booked On">
                            <p>{formatDate(booking.createdAt)}</p>
                          </div>
                          <div className="table-col" data-label="Amount">
                            <p className="booking-amount">{formatCurrency(booking.totalPrice || 0)}</p>
                          </div>
                          <div className="table-col" data-label="Status">
                            <span className={`status-badge ${booking.status}`}>
                              {booking.status}
                            </span>
                          </div>
                          <div className="table-col" data-label="Actions">
                            <div className="action-buttons">
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
                        <div className="empty-state">
                          <p>No bookings found</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Analytics Chart Placeholder */}
                <div className="chart-container">
                  <div className="chart-header">
                    <h3 className="chart-title">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="20" x2="18" y2="10"></line>
                        <line x1="12" y1="20" x2="12" y2="4"></line>
                        <line x1="6" y1="20" x2="6" y2="14"></line>
                      </svg>
                      Revenue Overview
                    </h3>
                    <div className="chart-legend">
                      <div className="legend-item">
                        <span className="legend-color primary"></span>
                        This Year
                      </div>
                      <div className="legend-item">
                        <span className="legend-color secondary"></span>
                        Last Year
                      </div>
                    </div>
                  </div>
                  <div className="chart-placeholder">
                    📈 Chart visualization would appear here
                  </div>
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="bookings-tab">
                <div className="tab-header">
                  <h3 className="tab-title">All Bookings</h3>
                </div>
                
                <div className="filter-section">
                  <input
                    type="text"
                    placeholder="Search bookings..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <select 
                    className="filter-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                
                <div className="bookings-table">
                  <div className="table-header">
                    <div>Tour & Details</div>
                    <div>Customer</div>
                    <div>Booking Date</div>
                    <div>Amount</div>
                    <div>Status</div>
                    <div>Actions</div>
                  </div>
                  
                  <div className="table-body">
                    {filteredBookings.map((booking) => (
                      <div key={booking._id} className="table-row">
                        <div className="table-col" data-label="Tour">
                          <div className="tour-info">
                            <h4>{booking.tour?.name || 'N/A'}</h4>
                            <p>👥 {booking.participants} participants • ⏱️ {booking.duration} days</p>
                            {booking.bookingDate && (
                              <p>📅 Tour: {formatDate(booking.bookingDate)}</p>
                            )}
                          </div>
                        </div>
                        <div className="table-col" data-label="Customer">
                          <p className="customer-name">{booking.user?.name || 'N/A'}</p>
                          <p className="customer-email">{booking.user?.email || 'N/A'}</p>
                        </div>
                        <div className="table-col" data-label="Booked On">
                          <p>{formatDate(booking.createdAt)}</p>
                        </div>
                        <div className="table-col" data-label="Amount">
                          <p className="booking-amount">{formatCurrency(booking.totalPrice || 0)}</p>
                        </div>
                        <div className="table-col" data-label="Status">
                          <span className={`status-badge ${booking.status}`}>
                            {booking.status}
                          </span>
                        </div>
                        <div className="table-col" data-label="Actions">
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
                    
                    {filteredBookings.length === 0 && (
                      <div className="empty-state">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="8" x2="12" y2="12"></line>
                          <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
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
                  <h3 className="tab-title">Pending Reviews ({reviews.length})</h3>
                </div>
                
                <div className="reviews-grid">
                  {reviews.map((review) => (
                    <div key={review._id} className="review-card">
                      <div className="review-header">
                        <div className="reviewer-info">
                          <h4 className="reviewer-name">{review.user?.name || 'Anonymous'}</h4>
                          <div className="review-rating">
                            {'★'.repeat(review.rating || 5)}
                            {'☆'.repeat(5 - (review.rating || 5))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="review-tour">
                        {review.tour || 'Unknown Tour'}
                      </div>
                      
                      <div className="review-content">
                        <h5 className="review-title">{review.title || 'No Title'}</h5>
                        <p className="review-comment">{review.comment || 'No comment provided'}</p>
                        <p className="review-date">{formatDate(review.createdAt)}</p>
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
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                      <p>No pending reviews</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="users-tab">
                <div className="tab-header">
                  <h3 className="tab-title">Users ({users.length})</h3>
                </div>
                
                <div className="users-table">
                  <div className="table-header">
                    <div>Name</div>
                    <div>Email</div>
                    <div>Role</div>
                    <div>Joined Date</div>
                    <div>Actions</div>
                  </div>
                  
                  <div className="table-body">
                    {users.map((userItem) => (
                      <div key={userItem._id} className="table-row">
                        <div className="table-col" data-label="Name">
                          <p className="customer-name">{userItem.name}</p>
                        </div>
                        <div className="table-col" data-label="Email">
                          <p className="customer-email">{userItem.email}</p>
                        </div>
                        <div className="table-col" data-label="Role">
                          <span className={`role-badge ${userItem.role}`}>
                            {userItem.role}
                          </span>
                        </div>
                        <div className="table-col" data-label="Joined">
                          <p>{formatDate(userItem.createdAt)}</p>
                        </div>
                        <div className="table-col" data-label="Actions">
                          <button className="action-btn view-btn">
                            View
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    {users.length === 0 && (
                      <div className="empty-state">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                        </svg>
                        <p>No users found</p>
                      </div>
                    )}
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