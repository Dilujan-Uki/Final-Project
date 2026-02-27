// src/pages/AdminDashboard.jsx (FIXED)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Stats state
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    totalRevenue: 0,
    totalUsers: 0,
    activeTours: 0
  });

  // Applications state
  const [applications, setApplications] = useState([]);
  const [applicationStats, setApplicationStats] = useState({
    total: 0,
    pending: 0,
    interview: 0,
    accepted: 0,
    rejected: 0
  });
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Bookings state
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
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

        if (user.role !== 'admin') {
          navigate('/account');
          return;
        }

        setIsAdmin(true);
        await fetchDashboardData(token);
        await fetchApplications(token);
        await fetchReviews(token);
      } catch (error) {
        console.error('Error checking admin:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [navigate]);

  const fetchApplications = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/guide-applications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.status === 'success') {
        setApplications(data.data);
        setApplicationStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const fetchReviews = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/reviews/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.status === 'success') {
        setReviews(data.data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleUpdateApplication = async (applicationId, newStatus) => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`http://localhost:5000/api/guide-applications/${applicationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          status: newStatus,
          rejectionReason: newStatus === 'rejected' ? rejectionReason : ''
        })
      });

      const data = await response.json();

      if (data.status === 'success') {
        alert(`✅ Application ${newStatus}`);
        setSelectedApplication(null);
        setRejectionReason('');
        fetchApplications(token); // Refresh
      }
    } catch (error) {
      console.error('Error updating application:', error);
      alert('Failed to update application');
    }
  };

  const handleApplicationAction = (app) => {
    setSelectedApplication(app);
    setRejectionReason(app.rejectionReason || '');
  };

  const fetchDashboardData = async (token) => {
    try {
      console.log('Fetching dashboard data...');

      // Fetch all bookings
      const bookingsRes = await fetch('http://localhost:5000/api/bookings/all', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        console.log('Bookings data received:', bookingsData);

        if (bookingsData.status === 'success') {
          setBookings(bookingsData.data);

          // Calculate stats
          const pending = bookingsData.data.filter(b => b.status === 'pending').length;
          const confirmed = bookingsData.data.filter(b => b.status === 'confirmed').length;
          const completed = bookingsData.data.filter(b => b.status === 'completed').length;
          const cancelled = bookingsData.data.filter(b => b.status === 'cancelled').length;
          const revenue = bookingsData.data.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

          setStats(prev => ({
            ...prev,
            totalBookings: bookingsData.data.length,
            pendingBookings: pending,
            confirmedBookings: confirmed,
            completedBookings: completed,
            cancelledBookings: cancelled,
            totalRevenue: revenue,
            activeTours: pending + confirmed
          }));
        }
      }

      // Fetch users
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
          booking._id === bookingId ? { ...booking, status: newStatus } : booking
        ));

        // Update stats
        const updatedBookings = bookings.map(b =>
          b._id === bookingId ? { ...b, status: newStatus } : b
        );

        const pending = updatedBookings.filter(b => b.status === 'pending').length;
        const confirmed = updatedBookings.filter(b => b.status === 'confirmed').length;
        const completed = updatedBookings.filter(b => b.status === 'completed').length;
        const cancelled = updatedBookings.filter(b => b.status === 'cancelled').length;

        setStats(prev => ({
          ...prev,
          pendingBookings: pending,
          confirmedBookings: confirmed,
          completedBookings: completed,
          cancelledBookings: cancelled
        }));

        alert(`✅ Booking status updated to ${newStatus}`);
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Failed to update booking status');
    }
  };

  const handleViewUserDetails = async (userId) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.status === 'success') {
        setSelectedUser(data.data.user);
        setUserDetails(data.data);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'confirmed': return '#17a2b8';
      case 'completed': return '#28a745';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  // Filter bookings based on search and status
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch =
      booking.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.tour?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

    // Date range filtering
    let matchesDate = true;
    if (dateRange !== 'all') {
      const bookingDate = new Date(booking.createdAt);
      const now = new Date();
      const daysDiff = Math.floor((now - bookingDate) / (1000 * 60 * 60 * 24));

      if (dateRange === 'today') matchesDate = daysDiff === 0;
      else if (dateRange === 'week') matchesDate = daysDiff <= 7;
      else if (dateRange === 'month') matchesDate = daysDiff <= 30;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Filter users based on search
  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                className={`nav-item ${activeTab === 'applications' ? 'active' : ''}`}
                onClick={() => setActiveTab('applications')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                Applications
                {applicationStats.pending > 0 && (
                  <span className="nav-badge">{applicationStats.pending}</span>
                )}
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
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-content">
                      <h3 className="stat-value">{stats.pendingBookings}</h3>
                      <p className="stat-label">Pending</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">✅</div>
                    <div className="stat-content">
                      <h3 className="stat-value">{stats.confirmedBookings}</h3>
                      <p className="stat-label">Confirmed</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">🎉</div>
                    <div className="stat-content">
                      <h3 className="stat-value">{stats.completedBookings}</h3>
                      <p className="stat-label">Completed</p>
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
                    <div className="stat-icon">👥</div>
                    <div className="stat-content">
                      <h3 className="stat-value">{stats.totalUsers}</h3>
                      <p className="stat-label">Total Users</p>
                    </div>
                  </div>
                </div>

                {/* Recent Reviews Section */}
                <div className="dashboard-card">
                  <div className="card-header">
                    <h3 className="card-title">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                      Recent Reviews
                    </h3>
                  </div>

                  <div className="reviews-grid">
                    {reviews.slice(0, 6).map((review) => (
                      <div key={review._id} className="review-card">
                        <div className="review-header">
                          <div className="reviewer-info">
                            <h4 className="reviewer-name">{review.user?.name || 'Anonymous'}</h4>
                            <span className="review-tour">{review.tour}</span>
                          </div>
                          <div className="review-rating">
                            {'★'.repeat(review.rating)}
                            {'☆'.repeat(5 - review.rating)}
                          </div>
                        </div>
                        <div className="review-content">
                          <h5 className="review-title">{review.title}</h5>
                          <p className="review-comment">{review.comment.substring(0, 100)}...</p>
                          {review.guide && (
                            <span className="review-guide">Guide: {review.guide}</span>
                          )}
                          <div className="review-footer">
                            <span className="review-date">
                              📅 {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                            <span className={`review-status ${review.isApproved ? 'approved' : 'pending'}`}>
                              {review.isApproved ? 'Approved' : 'Pending'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Bookings */}
                <div className="dashboard-card">
                  <div className="card-header">
                    <h3 className="card-title">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </button>
                  </div>

                  <div className="bookings-table">
                    <div className="table-header">
                      <div>Tour</div>
                      <div>Customer</div>
                      <div>Booking Date</div>
                      <div>Amount</div>
                      <div>Status</div>
                    </div>

                    <div className="table-body">
                      {bookings.slice(0, 5).map((booking) => (
                        <div key={booking._id} className="table-row">
                          <div className="table-col" data-label="Tour">
                            <div className="tour-info">
                              <h4>{booking.tour?.name || 'N/A'}</h4>
                              <p>👥 {booking.participants} • ⏱️ {booking.duration} days</p>
                            </div>
                          </div>
                          <div className="table-col" data-label="Customer">
                            <p className="customer-name">{booking.user?.name || 'N/A'}</p>
                            <p className="customer-email">{booking.user?.email || 'N/A'}</p>
                          </div>
                          <div className="table-col" data-label="Booked On">
                            <p>{formatDate(booking.bookingDate)}</p>
                          </div>
                          <div className="table-col" data-label="Amount">
                            <p className="booking-amount">{formatCurrency(booking.totalPrice || 0)}</p>
                          </div>
                          <div className="table-col" data-label="Status">
                            <span className={`status-badge ${booking.status}`}>
                              {booking.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Applications Tab */}
            {activeTab === 'applications' && (
              <div className="applications-tab">
                <div className="tab-header">
                  <h3 className="tab-title">Guide Applications</h3>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid small">
                  <div className="stat-card">
                    <div className="stat-icon">📝</div>
                    <div className="stat-content">
                      <h3 className="stat-value">{applicationStats.total}</h3>
                      <p className="stat-label">Total Applications</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-content">
                      <h3 className="stat-value">{applicationStats.pending}</h3>
                      <p className="stat-label">Pending</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">📞</div>
                    <div className="stat-content">
                      <h3 className="stat-value">{applicationStats.interview}</h3>
                      <p className="stat-label">Interview</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">✅</div>
                    <div className="stat-content">
                      <h3 className="stat-value">{applicationStats.accepted}</h3>
                      <p className="stat-label">Accepted</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">❌</div>
                    <div className="stat-content">
                      <h3 className="stat-value">{applicationStats.rejected}</h3>
                      <p className="stat-label">Rejected</p>
                    </div>
                  </div>
                </div>

                {/* Applications Table */}
                <div className="applications-table">
                  <div className="table-header">
                    <div>Name</div>
                    <div>Contact</div>
                    <div>Details</div>
                    <div>Experience</div>
                    <div>Status</div>
                    <div>Actions</div>
                  </div>

                  <div className="table-body">
                    {applications.map(app => (
                      <div key={app._id} className="table-row">
                        <div className="table-col" data-label="Name">
                          <p className="customer-name">{app.fullName}</p>
                          <p>Age: {app.age} | {app.gender}</p>
                        </div>
                        <div className="table-col" data-label="Contact">
                          <p>{app.email}</p>
                          <p>{app.phone}</p>
                        </div>
                        <div className="table-col" data-label="Details">
                          <p>Languages: {app.languages?.join(', ') || 'N/A'}</p>
                          <p>Specialties: {app.specialties?.slice(0, 3).join(', ')}</p>
                        </div>
                        <div className="table-col" data-label="Experience">
                          <p>{app.experience?.substring(0, 50)}...</p>
                        </div>
                        <div className="table-col" data-label="Status">
                          <span className={`status-badge ${app.status}`}>
                            {app.status}
                          </span>
                        </div>
                        <div className="table-col" data-label="Actions">
                          <button
                            className="action-btn view-btn"
                            onClick={() => handleApplicationAction(app)}
                          >
                            Review
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Application Review Modal */}
                {selectedApplication && (
                  <div className="modal-overlay" onClick={() => setSelectedApplication(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                      <div className="modal-header">
                        <h2>Review Application: {selectedApplication.fullName}</h2>
                        <button className="modal-close" onClick={() => setSelectedApplication(null)}>×</button>
                      </div>

                      <div className="modal-body">
                        <div className="info-grid">
                          <div className="info-item">
                            <label>Name:</label>
                            <span>{selectedApplication.fullName}</span>
                          </div>
                          <div className="info-item">
                            <label>Email:</label>
                            <span>{selectedApplication.email}</span>
                          </div>
                          <div className="info-item">
                            <label>Phone:</label>
                            <span>{selectedApplication.phone}</span>
                          </div>
                          <div className="info-item">
                            <label>Age/Gender:</label>
                            <span>{selectedApplication.age} / {selectedApplication.gender}</span>
                          </div>
                        </div>

                        <div className="info-item full-width">
                          <label>Experience:</label>
                          <p>{selectedApplication.experience}</p>
                        </div>

                        <div className="info-item full-width">
                          <label>Certifications:</label>
                          <p>{selectedApplication.certifications}</p>
                        </div>

                        <div className="info-item full-width">
                          <label>Languages:</label>
                          <p>{selectedApplication.languages?.join(', ')}</p>
                        </div>

                        <div className="info-item full-width">
                          <label>Specialties:</label>
                          <p>{selectedApplication.specialties?.join(', ')}</p>
                        </div>

                        <div className="action-buttons" style={{ marginTop: '2rem' }}>
                          <select 
                            className="status-select"
                            value={selectedApplication.status}
                            onChange={(e) => {
                              const newStatus = e.target.value;
                              setSelectedApplication({
                                ...selectedApplication,
                                status: newStatus
                              });
                            }}
                          >
                            <option value="pending">Pending</option>
                            <option value="interview">Interview</option>
                            <option value="accepted">Accept</option>
                            <option value="rejected">Reject</option>
                          </select>

                          {selectedApplication.status === 'rejected' && (
                            <div className="form-group">
                              <label>Rejection Reason *</label>
                              <textarea
                                placeholder="Why is this application being rejected?"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                rows="3"
                              />
                            </div>
                          )}

                          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button
                              className="btn-success"
                              onClick={() => handleUpdateApplication(selectedApplication._id, selectedApplication.status)}
                            >
                              Update Status
                            </button>
                            <button
                              className="btn-outline"
                              onClick={() => setSelectedApplication(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
                    placeholder="Search by customer or tour..."
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
                  <select
                    className="filter-select"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                </div>

                <div className="bookings-table">
                  <div className="table-header">
                    <div>Tour Details</div>
                    <div>Customer Info</div>
                    <div>Booking Details</div>
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
                            <p>📅 {formatDate(booking.bookingDate)}</p>
                          </div>
                        </div>
                        <div className="table-col" data-label="Customer">
                          <p className="customer-name">{booking.user?.name || 'N/A'}</p>
                          <p className="customer-email">{booking.user?.email || 'N/A'}</p>
                          <p className="customer-phone">{booking.user?.phone || 'N/A'}</p>
                        </div>
                        <div className="table-col" data-label="Details">
                          <p>👥 {booking.participants} people</p>
                          <p>⏱️ {booking.duration} days</p>
                          {booking.guideName && <p>👤 Guide: {booking.guideName}</p>}
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
                              style={{ borderColor: getStatusColor(booking.status) }}
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}

                    {filteredBookings.length === 0 && (
                      <div className="empty-state">
                        <p>No bookings found</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="users-tab">
                <div className="tab-header">
                  <h3 className="tab-title">Users ({users.length})</h3>
                </div>

                <div className="filter-section">
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="users-table">
                  <div className="table-header">
                    <div>Name</div>
                    <div>Email</div>
                    <div>Phone</div>
                    <div>Role</div>
                    <div>Bookings</div>
                    <div>Total Spent</div>
                    <div>Joined Date</div>
                    <div>Actions</div>
                  </div>

                  <div className="table-body">
                    {filteredUsers.map((userItem) => (
                      <div key={userItem._id} className="table-row">
                        <div className="table-col" data-label="Name">
                          <p className="customer-name">{userItem.name}</p>
                        </div>
                        <div className="table-col" data-label="Email">
                          <p className="customer-email">{userItem.email}</p>
                        </div>
                        <div className="table-col" data-label="Phone">
                          <p>{userItem.phone || 'N/A'}</p>
                        </div>
                        <div className="table-col" data-label="Role">
                          <span className={`role-badge ${userItem.role}`}>
                            {userItem.role}
                          </span>
                        </div>
                        <div className="table-col" data-label="Bookings">
                          <span className="nav-badge">{userItem.totalBookings || 0}</span>
                        </div>
                        <div className="table-col" data-label="Total Spent">
                          <p className="booking-amount">{formatCurrency(userItem.totalSpent || 0)}</p>
                        </div>
                        <div className="table-col" data-label="Joined">
                          <p>{formatDate(userItem.createdAt)}</p>
                        </div>
                        <div className="table-col" data-label="Actions">
                          <button
                            className="action-btn view-btn"
                            onClick={() => handleViewUserDetails(userItem._id)}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}

                    {filteredUsers.length === 0 && (
                      <div className="empty-state">
                        <p>No users found</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* User Details Modal */}
                {selectedUser && userDetails && (
                  <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                      <div className="modal-header">
                        <h2>User Details: {selectedUser.name}</h2>
                        <button className="modal-close" onClick={() => setSelectedUser(null)}>×</button>
                      </div>

                      <div className="modal-body">
                        {/* User Info */}
                        <div className="user-info-section">
                          <h3>Personal Information</h3>
                          <div className="info-grid">
                            <div className="info-item">
                              <label>Name:</label>
                              <span>{selectedUser.name}</span>
                            </div>
                            <div className="info-item">
                              <label>Email:</label>
                              <span>{selectedUser.email}</span>
                            </div>
                            <div className="info-item">
                              <label>Phone:</label>
                              <span>{selectedUser.phone || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                              <label>Role:</label>
                              <span className={`role-badge ${selectedUser.role}`}>{selectedUser.role}</span>
                            </div>
                            <div className="info-item">
                              <label>Member Since:</label>
                              <span>{formatDate(selectedUser.createdAt)}</span>
                            </div>
                          </div>
                        </div>

                        {/* User Stats */}
                        <div className="stats-grid small">
                          <div className="stat-card">
                            <div className="stat-icon">📊</div>
                            <div className="stat-content">
                              <h3 className="stat-value">{userDetails.stats.totalBookings}</h3>
                              <p className="stat-label">Total Bookings</p>
                            </div>
                          </div>
                          <div className="stat-card">
                            <div className="stat-icon">💰</div>
                            <div className="stat-content">
                              <h3 className="stat-value">{formatCurrency(userDetails.stats.totalSpent)}</h3>
                              <p className="stat-label">Total Spent</p>
                            </div>
                          </div>
                          <div className="stat-card">
                            <div className="stat-icon">⏳</div>
                            <div className="stat-content">
                              <h3 className="stat-value">{userDetails.stats.pendingBookings}</h3>
                              <p className="stat-label">Pending</p>
                            </div>
                          </div>
                          <div className="stat-card">
                            <div className="stat-icon">✅</div>
                            <div className="stat-content">
                              <h3 className="stat-value">{userDetails.stats.completedBookings}</h3>
                              <p className="stat-label">Completed</p>
                            </div>
                          </div>
                        </div>

                        {/* User's Bookings */}
                        <div className="user-bookings-section">
                          <h3>Booking History</h3>
                          <div className="bookings-table">
                            <div className="table-header">
                              <div>Tour</div>
                              <div>Date</div>
                              <div>Participants</div>
                              <div>Amount</div>
                              <div>Status</div>
                            </div>
                            <div className="table-body">
                              {userDetails.bookings.map((booking) => (
                                <div key={booking._id} className="table-row">
                                  <div className="table-col">
                                    <p className="customer-name">{booking.tour?.name}</p>
                                  </div>
                                  <div className="table-col">
                                    <p>{formatDate(booking.bookingDate)}</p>
                                  </div>
                                  <div className="table-col">
                                    <p>{booking.participants}</p>
                                  </div>
                                  <div className="table-col">
                                    <p className="booking-amount">{formatCurrency(booking.totalPrice)}</p>
                                  </div>
                                  <div className="table-col">
                                    <span className={`status-badge ${booking.status}`}>
                                      {booking.status}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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

export default AdminDashboard;