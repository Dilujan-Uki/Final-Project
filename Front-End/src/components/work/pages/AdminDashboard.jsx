// src/pages/AdminDashboard.jsx - COMPLETE REPLACE
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
        await fetchDashboardData(token);
        await fetchApplications(token);
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
        fetchApplications(token);
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
          {/* Sidebar - REMOVED BOOKINGS TAB */}
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
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                </svg>
                Applications
                {applicationStats.pending > 0 && (
                  <span className="nav-badge">{applicationStats.pending}</span>
                )}
              </button>

              <button
                className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => setActiveTab('users')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

                {/* Recent Bookings - FIXED to show all bookings */}
                <div className="dashboard-card">
                  <div className="card-header">
                    <h3 className="card-title">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      All Bookings
                    </h3>
                  </div>

                  {bookings.length === 0 ? (
                    <div className="empty-state">
                      <p>No bookings found in the system</p>
                    </div>
                  ) : (
                    <div className="simple-bookings-list">
                      {bookings.map((booking) => (
                        <div key={booking._id} className="simple-booking-item">
                          <div className="simple-booking-info">
                            <div className="simple-booking-header">
                              <span className="simple-tour-name">
                                {booking.tour?.name || booking.tourName || 'Unknown Tour'}
                              </span>
                              <span className={`simple-status ${booking.status || 'pending'}`}>
                                {booking.status === 'pending' ? 'booked' : (booking.status || 'pending')}
                              </span>
                            </div>
                            <div className="simple-customer-details">
                              <span className="customer-name">
                                👤 {booking.user?.name || booking.userId?.name || 'Unknown'}
                              </span>
                              <span className="customer-email">
                                {booking.user?.email || booking.userId?.email || ''}
                              </span>
                            </div>
                            <div className="simple-booking-meta">
                              <span>📅 {formatDate(booking.bookingDate || booking.createdAt)}</span>
                              <span>👥 {booking.participants || 1} people</span>
                              <span>⏱️ {booking.duration || 1} days</span>
                              {booking.guideName && (
                                <span>👤 Guide: {booking.guideName}</span>
                              )}
                            </div>
                            <div className="simple-price">
                              💰 {formatCurrency(booking.totalPrice || 0)}
                            </div>
                            <div className="simple-price-status">
                              <select
                                className="status-select-small"
                                value={booking.status}
                                onChange={(e) => handleUpdateBookingStatus(booking._id, e.target.value)}
                                style={{ borderColor: getStatusColor(booking.status) }}
                              >
                                <option value="pending">booked</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                      <p className="stat-label">Total</p>
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

                {/* Filter Section */}
                <div className="filter-section">
                  <input
                    type="text"
                    placeholder="Search applications..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <select
                    className="filter-select styled-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="interview">Interview</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                {/* Applications Table */}
                <div className="applications-table">
                  <div className="table-header">
                    <div>Name & Contact</div>
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
                          <p className="customer-email">{app.email}</p>
                          <p className="customer-phone">{app.phone}</p>
                        </div>
                        <div className="table-col" data-label="Details">
                          <p>Age: {app.age} | {app.gender}</p>
                          <p>Languages: {app.languages?.length || 0}</p>
                          <p>Specialties: {app.specialties?.length || 0}</p>
                        </div>
                        <div className="table-col" data-label="Experience">
                          <p>{app.experience}</p>
                          <p className="cert-preview">{app.certifications?.substring(0, 30)}...</p>
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
                        <h2>Review Application</h2>
                        <button className="modal-close" onClick={() => setSelectedApplication(null)}>×</button>
                      </div>

                      <div className="modal-body">
                        <div className="application-detail-section">
                          <h4>Personal Information</h4>
                          <div className="detail-grid">
                            <div className="detail-item">
                              <label>Name:</label>
                              <span>{selectedApplication.fullName}</span>
                            </div>
                            <div className="detail-item">
                              <label>Email:</label>
                              <span>{selectedApplication.email}</span>
                            </div>
                            <div className="detail-item">
                              <label>Phone:</label>
                              <span>{selectedApplication.phone}</span>
                            </div>
                            <div className="detail-item">
                              <label>Age/Gender:</label>
                              <span>{selectedApplication.age} / {selectedApplication.gender}</span>
                            </div>
                          </div>
                        </div>

                        <div className="application-detail-section">
                          <h4>Professional Details</h4>
                          <div className="detail-item full-width">
                            <label>Experience:</label>
                            <p>{selectedApplication.experience}</p>
                          </div>
                          <div className="detail-item full-width">
                            <label>Certifications:</label>
                            <p>{selectedApplication.certifications}</p>
                          </div>
                          <div className="detail-item full-width">
                            <label>Languages:</label>
                            <div className="tag-list">
                              {selectedApplication.languages?.map(lang => (
                                <span key={lang} className="tag">{lang}</span>
                              ))}
                            </div>
                          </div>
                          <div className="detail-item full-width">
                            <label>Specialties:</label>
                            <div className="tag-list">
                              {selectedApplication.specialties?.map(spec => (
                                <span key={spec} className="tag">{spec}</span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="status-update-section">
                          <label>Update Status:</label>
                          <div className="status-buttons">
                            <button
                              className={`status-btn ${selectedApplication.status === 'pending' ? 'active' : ''}`}
                              onClick={() => setSelectedApplication({ ...selectedApplication, status: 'pending' })}
                            >
                              ⏳ Pending
                            </button>
                            <button
                              className={`status-btn ${selectedApplication.status === 'interview' ? 'active' : ''}`}
                              onClick={() => setSelectedApplication({ ...selectedApplication, status: 'interview' })}
                            >
                              📞 Interview
                            </button>
                            <button
                              className={`status-btn ${selectedApplication.status === 'accepted' ? 'active' : ''}`}
                              onClick={() => setSelectedApplication({ ...selectedApplication, status: 'accepted' })}
                            >
                              ✅ Accept
                            </button>
                            <button
                              className={`status-btn ${selectedApplication.status === 'rejected' ? 'active' : ''}`}
                              onClick={() => setSelectedApplication({ ...selectedApplication, status: 'rejected' })}
                            >
                              ❌ Reject
                            </button>
                          </div>

                          {selectedApplication.status === 'rejected' && (
                            <div className="rejection-reason">
                              <label>Rejection Reason:</label>
                              <textarea
                                placeholder="Why is this application being rejected?"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                rows="3"
                              />
                            </div>
                          )}

                          {selectedApplication.status === 'accepted' && (
                            <div className="success-message small">
                              ✅ When accepted, a guide account will be created and an email will be sent with login details.
                            </div>
                          )}

                          {selectedApplication.status === 'interview' && (
                            <div className="info-message">
                              📞 Set to Interview - The applicant will be contacted for an interview.
                            </div>
                          )}

                          <div className="action-buttons">
                            <button
                              className="btn-primary"
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

                <div className="simple-users-list">
                  {users.filter(user =>
                    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map((userItem) => (
                    <div key={userItem._id} className="simple-user-item">
                      <div className="simple-user-info">
                        <div className="simple-user-avatar">
                          {userItem.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="simple-user-details">
                          <span className="simple-user-name">{userItem.name}</span>
                          <span className="simple-user-email">{userItem.email}</span>
                          <span className="simple-user-phone">{userItem.phone || 'No phone'}</span>
                        </div>
                        <span className={`role-badge-small ${userItem.role}`}>
                          {userItem.role}
                        </span>
                      </div>
                      <button
                        className="view-user-btn"
                        onClick={() => handleViewUserDetails(userItem._id)}
                      >
                        View Details
                      </button>
                    </div>
                  ))}
                </div>

                {/* User Details Modal */}
                {selectedUser && (
                  <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
                    <div className="modal-content small" onClick={e => e.stopPropagation()}>
                      <div className="modal-header">
                        <h2>User Details</h2>
                        <button className="modal-close" onClick={() => setSelectedUser(null)}>×</button>
                      </div>

                      <div className="modal-body">
                        <div className="user-profile-card">
                          <div className="user-avatar-large">
                            {selectedUser.name?.charAt(0).toUpperCase()}
                          </div>
                          <h3 className="user-name-large">{selectedUser.name}</h3>
                          <span className={`role-badge-large ${selectedUser.role}`}>
                            {selectedUser.role}
                          </span>
                        </div>

                        <div className="user-info-section">
                          <h4>Personal Information</h4>
                          <div className="info-grid">
                            <div className="info-item">
                              <label>Full Name</label>
                              <span>{selectedUser.name}</span>
                            </div>
                            <div className="info-item">
                              <label>Email Address</label>
                              <span>{selectedUser.email}</span>
                            </div>
                            <div className="info-item">
                              <label>Phone Number</label>
                              <span>{selectedUser.phone || 'Not provided'}</span>
                            </div>
                            <div className="info-item">
                              <label>Address</label>
                              <span>{selectedUser.address || 'Not provided'}</span>
                            </div>
                            <div className="info-item">
                              <label>Member Since</label>
                              <span>{formatDate(selectedUser.createdAt)}</span>
                            </div>
                            <div className="info-item">
                              <label>Preferred Language</label>
                              <span>{selectedUser.preferences?.language || 'English'}</span>
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