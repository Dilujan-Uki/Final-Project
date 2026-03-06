import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  const [stats, setStats] = useState({ totalBookings: 0, pendingBookings: 0, confirmedBookings: 0, completedBookings: 0, cancelledBookings: 0, totalRevenue: 0, totalUsers: 0, totalGuides: 0 });
  const [applications, setApplications] = useState([]);
  const [applicationStats, setApplicationStats] = useState({ total: 0, pending: 0, interview: 0, accepted: 0, rejected: 0 });
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({ total: 0, pending: 0, approved: 0 });
  const [regularUsers, setRegularUsers] = useState([]);
  const [guides, setGuides] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedGuide, setSelectedGuide] = useState(null);

  const [pendingCompletions, setPendingCompletions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [guideCategoryFilter, setGuideCategoryFilter] = useState('all');

  const [suspendModalData, setSuspendModalData] = useState(null);
  const [suspendReason, setSuspendReason] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      const userData = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (!userData || !token) { navigate('/login'); return; }
      try {
        const u = JSON.parse(userData);
        setUser(u);
        if (u.role !== 'admin') { navigate('/account'); return; }
        setIsAdmin(true);
        await Promise.all([
          fetchDashboardData(token),
          fetchApplications(token),
          fetchGuides(token),
          fetchPendingCompletions(token)
        ]);
      } catch (error) {
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    checkAdmin();
  }, [navigate]);

  const fetchApplications = async (token) => {
    try {
      const res = await fetch('http://localhost:5000/api/guide-applications', { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      if (data.status === 'success') { setApplications(data.data); setApplicationStats(data.stats); }
    } catch (e) { console.error(e); }
  };

  const fetchGuides = async (token) => {
    try {
      const res = await fetch('http://localhost:5000/api/guides/profiles-admin', { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      if (data.status === 'success') { setGuides(data.data); setStats(prev => ({ ...prev, totalGuides: data.data.length })); }
    } catch (e) { console.error(e); }
  };

  const fetchPendingCompletions = async (token) => {
    try {
      const res = await fetch('http://localhost:5000/api/guides/assignments/pending-completions', { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      if (data.status === 'success') setPendingCompletions(data.data);
    } catch (e) { console.error(e); }
  };

  const fetchDashboardData = async (token) => {
    try {
      const [bookingsRes, usersRes, reviewsRes] = await Promise.all([
        fetch('http://localhost:5000/api/bookings/all', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('http://localhost:5000/api/users', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('http://localhost:5000/api/reviews/all', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (bookingsRes.ok) {
        const bd = await bookingsRes.json();
        if (bd.status === 'success') {
          setBookings(bd.data);
          setStats(prev => ({
            ...prev,
            totalBookings: bd.data.length,
            pendingBookings: bd.data.filter(b => b.status === 'pending').length,
            confirmedBookings: bd.data.filter(b => b.status === 'confirmed').length,
            completedBookings: bd.data.filter(b => b.status === 'completed').length,
            cancelledBookings: bd.data.filter(b => b.status === 'cancelled').length,
            totalRevenue: bd.data.reduce((s, b) => s + (b.totalPrice || 0), 0)
          }));
        }
      }

      if (usersRes.ok) {
        const ud = await usersRes.json();
        if (ud.status === 'success') {
          const regular = ud.data.filter(u => u.role === 'user');
          setRegularUsers(regular);
          setStats(prev => ({ ...prev, totalUsers: regular.length }));
        }
      }

      if (reviewsRes.ok) {
        const rd = await reviewsRes.json();
        if (rd.status === 'success') {
          const allReviews = rd.data || [];
          setReviews(allReviews);
          setReviewStats({ total: allReviews.length, pending: allReviews.filter(r => !r.isApproved).length, approved: allReviews.filter(r => r.isApproved).length });
        }
      }
    } catch (e) { console.error(e); }
  };

  const handleUpdateApplication = async (applicationId, newStatus) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/guide-applications/${applicationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus, rejectionReason: newStatus === 'rejected' ? rejectionReason : '' })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setSelectedApplication(null);
        setRejectionReason('');
        fetchApplications(token);
        if (newStatus === 'accepted') fetchGuides(token);
      }
    } catch (e) { console.error(e); }
  };

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: newStatus } : b));
        setStats(prev => {
          const updated = bookings.map(b => b._id === bookingId ? { ...b, status: newStatus } : b);
          return { ...prev, pendingBookings: updated.filter(b => b.status === 'pending').length, confirmedBookings: updated.filter(b => b.status === 'confirmed').length, completedBookings: updated.filter(b => b.status === 'completed').length, cancelledBookings: updated.filter(b => b.status === 'cancelled').length };
        });
      }
    } catch (e) { console.error(e); }
  };

  const handleApproveReview = async (reviewId, isApproved) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/reviews/${reviewId}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ isApproved })
      });
      if (res.ok) {
        setReviews(prev => prev.map(r => r._id === reviewId ? { ...r, isApproved } : r));
        setReviewStats(prev => ({ ...prev, pending: prev.pending + (isApproved ? -1 : 1), approved: prev.approved + (isApproved ? 1 : -1) }));
      }
    } catch (e) { console.error(e); }
  };

  const handleViewUserDetails = async (userId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/users/${userId}`, { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      if (data.status === 'success') setSelectedUser(data.data.user);
    } catch (e) { console.error(e); }
  };

  const handleSuspendAction = (entity, type) => {
    setSuspendModalData({ entity, type });
    setSuspendReason('');
  };

  const confirmSuspend = async () => {
    if (!suspendModalData) return;
    const { entity, type } = suspendModalData;
    const token = localStorage.getItem('token');
    const isSuspending = !entity.isSuspended;
    try {
      const url = type === 'user'
        ? `http://localhost:5000/api/users/${entity._id}/suspend`
        : `http://localhost:5000/api/guides/profiles/${entity._id}/suspend`;
      const res = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ isSuspended: isSuspending, reason: suspendReason })
      });
      const data = await res.json();
      if (data.status === 'success') {
        if (type === 'user') {
          setRegularUsers(prev => prev.map(u => u._id === entity._id ? { ...u, isSuspended: isSuspending, suspendedReason: suspendReason } : u));
          if (selectedUser?._id === entity._id) setSelectedUser(prev => ({ ...prev, isSuspended: isSuspending, suspendedReason: suspendReason }));
        } else {
          setGuides(prev => prev.map(g => g._id === entity._id ? { ...g, isSuspended: isSuspending, suspendedReason: suspendReason } : g));
          if (selectedGuide?._id === entity._id) setSelectedGuide(prev => ({ ...prev, isSuspended: isSuspending, suspendedReason: suspendReason }));
        }
        setSuspendModalData(null);
      }
    } catch (e) { console.error(e); }
  };

  const handleConfirmCompletion = async (assignmentId, confirm) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/guides/assignments/${assignmentId}/confirm-completion`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ confirm })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setPendingCompletions(prev => prev.filter(a => a._id !== assignmentId));
        if (confirm) fetchDashboardData(token);
      }
    } catch (e) { console.error(e); }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const formatCurrency = (a) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(a);
  const getCurrentDate = () => new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  if (loading) return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="loading-page"><div className="loading-spinner"></div><p>Loading admin dashboard...</p></div>
      </div>
    </div>
  );
  if (!isAdmin) return null;

  // Count users/guides/bookings registered/created in the last 24 hours
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;
  const newUsersCount = regularUsers.filter(u => u.createdAt && (now - new Date(u.createdAt).getTime()) < oneDayMs).length;
  const newGuidesCount = guides.filter(g => g.createdAt && (now - new Date(g.createdAt).getTime()) < oneDayMs).length;

  const navItems = [
    { key: 'dashboard', label: 'Dashboard', badge: null },
    { key: 'users', label: 'Regular Users', badge: newUsersCount || null },
    { key: 'guides', label: 'Tour Guides', badge: newGuidesCount || null },
    { key: 'applications', label: 'Applications', badge: applicationStats.pending || null },
    { key: 'completions', label: 'Tour Completions', badge: pendingCompletions.length || null },
    { key: 'reviews', label: 'Reviews', badge: reviewStats.pending || null },
  ];

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="admin-header">
          <div className="admin-header-content">
            <h1 className="admin-title">Welcome back, <span>{user?.name?.split(' ')[0]}</span></h1>
            <p className="admin-subtitle">
              <span className="admin-badge">Administrator</span>
              <span className="admin-date">{getCurrentDate()}</span>
            </p>
          </div>
        </div>

        <div className="admin-content">
          <aside className="admin-sidebar">
            <div className="sidebar-profile">
              <div className="profile-avatar admin-avatar"><span>A</span></div>
              <div className="profile-info">
                <h3 className="profile-name">{user?.name}</h3>
                <span className="profile-role">Administrator</span>
                <p className="profile-email">{user?.email}</p>
              </div>
            </div>
            <nav className="sidebar-nav">
              {navItems.map(({ key, label, badge }) => (
                <button key={key} className={`nav-item ${activeTab === key ? 'active' : ''}`} onClick={() => setActiveTab(key)}>
                  {label}
                  {badge != null && badge > 0 && <span className="nav-badge">{badge}</span>}
                </button>
              ))}
              <button className="nav-item" onClick={() => navigate('/account')}>My Account</button>
            </nav>
          </aside>

          <main className="admin-main">

            {/* DASHBOARD TAB */}
            {activeTab === 'dashboard' && (
              <div className="dashboard-tab">
                <div className="stats-grid">
                  {[
                    { label: 'Total Bookings', value: stats.totalBookings },
                    { label: 'Pending', value: stats.pendingBookings },
                    { label: 'Confirmed', value: stats.confirmedBookings },
                    { label: 'Completed', value: stats.completedBookings },
                    { label: 'Cancelled', value: stats.cancelledBookings },
                    { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue) },
                    { label: 'Regular Users', value: stats.totalUsers },
                    { label: 'Tour Guides', value: stats.totalGuides },
                  ].map(({ label, value }) => (
                    <div key={label} className="stat-card">
                      <div className="stat-content">
                        <h3 className="stat-value">{value}</h3>
                        <p className="stat-label">{label}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {pendingCompletions.length > 0 && (
                  <div className="dashboard-card alert-card">
                    <div className="card-header">
                      <h3 className="card-title">Pending Tour Completion Confirmations</h3>
                      <span className="alert-badge">{pendingCompletions.length}</span>
                    </div>
                    <p className="card-description">These tours have been reported as completed by guides and need your confirmation.</p>
                    <button className="btn-primary" onClick={() => setActiveTab('completions')}>Review Completions</button>
                  </div>
                )}

                <div className="dashboard-card">
                  <div className="card-header">
                    <h3 className="card-title">All Bookings</h3>
                  </div>
                  {bookings.length === 0 ? (
                    <div className="empty-state"><p>No bookings found</p></div>
                  ) : (
                    <div className="simple-bookings-list">
                      {bookings.map((booking) => (
                        <div key={booking._id} className="simple-booking-item">
                          <div className="simple-booking-info">
                            <div className="simple-booking-header">
                              <span className="simple-tour-name">{booking.tour?.name || booking.tourName || 'Unknown Tour'}</span>
                              <span className={`simple-status ${booking.status}`}>
                                {booking.status === 'pending' ? 'Booked' : booking.status}
                              </span>
                            </div>
                            <div className="simple-customer-details">
                              <span className="customer-name">{booking.user?.name || booking.userId?.name || 'Unknown'}</span>
                              <span className="customer-email">{booking.user?.email || booking.userId?.email || ''}</span>
                            </div>
                            <div className="simple-booking-meta">
                              <span>{formatDate(booking.bookingDate || booking.createdAt)}</span>
                              <span>{booking.participants || 1} people</span>
                              <span>{booking.duration || 1} days</span>
                              {booking.guideName && <span>Guide: {booking.guideName}</span>}
                            </div>
                            <div className="simple-booking-footer">
                              <div className="simple-price-col">
                                <span className="simple-price">{formatCurrency(booking.totalPrice || 0)}</span>
                                {booking.status === 'cancelled' && booking.refundAmount > 0 && (
                                  <span className="refund-tag">Refund: {formatCurrency(booking.refundAmount)}</span>
                                )}
                              </div>
                              <select
                                className={`status-select-small status-${booking.status}`}
                                value={booking.status}
                                onChange={(e) => handleUpdateBookingStatus(booking._id, e.target.value)}
                              >
                                <option value="pending">Booked</option>
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

            {/* USERS TAB */}
            {activeTab === 'users' && (
              <div className="users-tab">
                <div className="tab-header">
                  <h3 className="tab-title">Regular Users ({regularUsers.length})</h3>
                </div>
                <div className="filter-section">
                  <input type="text" placeholder="Search users by name or email..." className="search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className="simple-users-list">
                  {regularUsers.filter(u => u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase())).map((userItem) => (
                    <div key={userItem._id} className={`simple-user-item ${userItem.isSuspended ? 'suspended-item' : ''}`}>
                      <div className="simple-user-info">
                        <div className="simple-user-avatar">{userItem.name?.charAt(0).toUpperCase()}</div>
                        <div className="simple-user-details">
                          <span className="simple-user-name">{userItem.name}</span>
                          <span className="simple-user-email">{userItem.email}</span>
                          <span className="simple-user-phone">{userItem.phone || 'No phone'}</span>
                          {userItem.isSuspended && <span className="suspended-tag">Suspended</span>}
                        </div>
                        <span className="role-badge-small user">User</span>
                      </div>
                      <div className="user-actions">
                        <button className="view-user-btn" onClick={() => handleViewUserDetails(userItem._id)}>View Details</button>
                        <button
                          className={`suspend-btn ${userItem.isSuspended ? 'unsuspend' : 'suspend'}`}
                          onClick={() => handleSuspendAction(userItem, 'user')}
                        >
                          {userItem.isSuspended ? 'Unsuspend' : 'Suspend'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedUser && (
                  <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
                    <div className="modal-content small" onClick={e => e.stopPropagation()}>
                      <div className="modal-header">
                        <h2>User Details</h2>
                        <button className="modal-close" onClick={() => setSelectedUser(null)}>×</button>
                      </div>
                      <div className="modal-body">
                        {selectedUser.isSuspended && (
                          <div className="suspended-notice">
                            Account Suspended {selectedUser.suspendedReason && `— ${selectedUser.suspendedReason}`}
                          </div>
                        )}
                        <div className="user-profile-card">
                          <div className="user-avatar-large">{selectedUser.name?.charAt(0).toUpperCase()}</div>
                          <h3 className="user-name-large">{selectedUser.name}</h3>
                          <span className="role-badge-large user">Regular User</span>
                        </div>
                        <div className="user-info-section">
                          <h4>Personal Information</h4>
                          <div className="info-grid">
                            {[
                              { label: 'Full Name', value: selectedUser.name },
                              { label: 'Email Address', value: selectedUser.email },
                              { label: 'Phone Number', value: selectedUser.phone || 'Not provided' },
                              { label: 'Address', value: selectedUser.address || 'Not provided' },
                              { label: 'Member Since', value: formatDate(selectedUser.createdAt) },
                              { label: 'Preferred Language', value: selectedUser.preferences?.language || 'English' },
                            ].map(({ label, value }) => (
                              <div key={label} className="info-item"><label>{label}</label><span>{value}</span></div>
                            ))}
                          </div>
                        </div>
                        <div className="modal-actions">
                          <button
                            className={`btn-${selectedUser.isSuspended ? 'secondary' : 'danger'}`}
                            onClick={() => { setSelectedUser(null); handleSuspendAction(selectedUser, 'user'); }}
                          >
                            {selectedUser.isSuspended ? 'Unsuspend Account' : 'Suspend Account'}
                          </button>
                          <button className="btn-outline" onClick={() => setSelectedUser(null)}>Close</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* GUIDES TAB */}
            {activeTab === 'guides' && (
              <div className="guides-tab">
                <div className="tab-header">
                  <h3 className="tab-title">Tour Guides ({guides.length})</h3>
                </div>
                <div className="filter-section">
                  <input type="text" placeholder="Search guides by name or email..." className="search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  <select className="filter-select" value={guideCategoryFilter} onChange={(e) => setGuideCategoryFilter(e.target.value)}>
                    <option value="all">All Categories</option>
                    {['cultural', 'wildlife', 'adventure', 'beach', 'photography'].map(c => (
                      <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div className="guides-grid-admin">
                  {guides.filter(g =>
                    (g.name?.toLowerCase().includes(searchTerm.toLowerCase()) || g.email?.toLowerCase().includes(searchTerm.toLowerCase())) &&
                    (guideCategoryFilter === 'all' || g.category === guideCategoryFilter)
                  ).map((g) => (
                    <div key={g._id} className={`guide-card-admin ${g.isSuspended ? 'suspended-card' : ''}`}>
                      <div className="guide-card-header">
                        <div className="guide-avatar-large">{g.name?.charAt(0).toUpperCase()}</div>
                        <div className="guide-rating-badge-admin">{g.rating} ★</div>
                        {g.isSuspended && <div className="suspended-overlay-badge">Suspended</div>}
                      </div>
                      <div className="guide-card-body">
                        <h4 className="guide-name-admin">{g.name}</h4>
                        <p className="guide-email-admin">{g.email}</p>
                        <div className="guide-category-tag">{g.category || 'Cultural'}</div>
                        <div className="guide-stats-admin">
                          <div className="stat"><span className="stat-label">Daily Rate</span><span className="stat-value">${g.dailyRate}/day</span></div>
                          <div className="stat"><span className="stat-label">Reviews</span><span className="stat-value">{g.totalReviews || 0}</span></div>
                        </div>
                        <div className="guide-specialties-admin">
                          {g.specialties?.slice(0, 3).map((s, i) => <span key={i} className="specialty-tag-small">{s}</span>)}
                          {g.specialties?.length > 3 && <span className="specialty-tag-small">+{g.specialties.length - 3}</span>}
                        </div>
                      </div>
                      <div className="guide-card-footer">
                        <button className="view-guide-btn" onClick={() => { setSelectedGuide(g); }}>View Details</button>
                        <button
                          className={`suspend-btn ${g.isSuspended ? 'unsuspend' : 'suspend'}`}
                          onClick={() => handleSuspendAction(g, 'guide')}
                        >
                          {g.isSuspended ? 'Unsuspend' : 'Suspend'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedGuide && (
                  <div className="modal-overlay" onClick={() => setSelectedGuide(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                      <div className="modal-header">
                        <h2>Guide Details</h2>
                        <button className="modal-close" onClick={() => setSelectedGuide(null)}>×</button>
                      </div>
                      <div className="modal-body">
                        {selectedGuide.isSuspended && (
                          <div className="suspended-notice">
                            Account Suspended {selectedGuide.suspendedReason && `— ${selectedGuide.suspendedReason}`}
                          </div>
                        )}
                        <div className="guide-profile-header">
                          <div className="guide-profile-avatar">{selectedGuide.name?.charAt(0).toUpperCase()}</div>
                          <div>
                            <h3>{selectedGuide.name}</h3>
                            <p>{selectedGuide.email}</p>
                            <div className="guide-profile-rating">
                              <span className="stars">{'★'.repeat(Math.floor(selectedGuide.rating || 0))}</span>
                              <span>({selectedGuide.totalReviews || 0} reviews)</span>
                            </div>
                          </div>
                        </div>
                        <div className="guide-details-grid">
                          <div className="detail-section">
                            <h4>Professional Information</h4>
                            <div className="detail-item"><label>Experience:</label><span>{selectedGuide.experience || 'Not specified'}</span></div>
                            <div className="detail-item"><label>Category:</label><span className="category-badge">{selectedGuide.category}</span></div>
                            <div className="detail-item"><label>Phone:</label><span>{selectedGuide.phone || 'Not provided'}</span></div>
                          </div>
                          <div className="detail-section">
                            <h4>Rates</h4>
                            <div className="detail-item"><label>Daily Rate:</label><span>${selectedGuide.dailyRate}/day</span></div>
                          </div>
                          <div className="detail-section full-width"><h4>Bio</h4><p>{selectedGuide.bio || 'No bio provided'}</p></div>
                          <div className="detail-section full-width">
                            <h4>Specialties</h4>
                            <div className="tag-list">{selectedGuide.specialties?.map((s, i) => <span key={i} className="tag">{s}</span>)}</div>
                          </div>
                          <div className="detail-section full-width">
                            <h4>Languages</h4>
                            <div className="tag-list">{selectedGuide.languages?.map((l, i) => <span key={i} className="tag">{l}</span>)}</div>
                          </div>
                        </div>
                        <div className="modal-actions">
                          <button
                            className={`btn-${selectedGuide.isSuspended ? 'secondary' : 'danger'}`}
                            onClick={() => { setSelectedGuide(null); handleSuspendAction(selectedGuide, 'guide'); }}
                          >
                            {selectedGuide.isSuspended ? 'Unsuspend Account' : 'Suspend Account'}
                          </button>
                          <button className="btn-outline" onClick={() => setSelectedGuide(null)}>Close</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* APPLICATIONS TAB */}
            {activeTab === 'applications' && (
              <div className="applications-tab">
                <div className="tab-header"><h3 className="tab-title">Guide Applications</h3></div>
                <div className="stats-grid small">
                  {[['Total', applicationStats.total], ['Pending', applicationStats.pending], ['Interview', applicationStats.interview], ['Accepted', applicationStats.accepted], ['Rejected', applicationStats.rejected]].map(([l, v]) => (
                    <div key={l} className="stat-card"><div className="stat-content"><h3 className="stat-value">{v}</h3><p className="stat-label">{l}</p></div></div>
                  ))}
                </div>
                <div className="filter-section">
                  <input type="text" placeholder="Search applications..." className="search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="interview">Interview</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div className="applications-table">
                  <div className="table-header"><div>Name & Contact</div><div>Details</div><div>Experience</div><div>Status</div><div>Actions</div></div>
                  <div className="table-body">
                    {applications.filter(app =>
                      (statusFilter === 'all' || app.status === statusFilter) &&
                      (app.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || app.email?.toLowerCase().includes(searchTerm.toLowerCase()))
                    ).map(app => (
                      <div key={app._id} className="table-row">
                        <div className="table-col"><p className="customer-name">{app.fullName}</p><p className="customer-email">{app.email}</p><p className="customer-phone">{app.phone}</p></div>
                        <div className="table-col"><p>Age: {app.age} | {app.gender}</p><p>Languages: {app.languages?.length || 0}</p></div>
                        <div className="table-col"><p>{app.experience}</p></div>
                        <div className="table-col"><span className={`status-badge ${app.status}`}>{app.status}</span></div>
                        <div className="table-col"><button className="action-btn view-btn" onClick={() => { setSelectedApplication(app); setRejectionReason(app.rejectionReason || ''); }}>Review</button></div>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedApplication && (
                  <div className="modal-overlay" onClick={() => setSelectedApplication(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                      <div className="modal-header"><h2>Review Application</h2><button className="modal-close" onClick={() => setSelectedApplication(null)}>×</button></div>
                      <div className="modal-body">
                        <div className="application-detail-section">
                          <h4>Personal Information</h4>
                          <div className="detail-grid">
                            {[['Name', selectedApplication.fullName], ['Email', selectedApplication.email], ['Phone', selectedApplication.phone], ['Age/Gender', `${selectedApplication.age} / ${selectedApplication.gender}`]].map(([l, v]) => (
                              <div key={l} className="detail-item"><label>{l}:</label><span>{v}</span></div>
                            ))}
                          </div>
                        </div>
                        <div className="application-detail-section">
                          <h4>Professional Details</h4>
                          <div className="detail-item full-width"><label>Experience:</label><p>{selectedApplication.experience}</p></div>
                          <div className="detail-item full-width"><label>Certifications:</label><p>{selectedApplication.certifications}</p></div>
                          <div className="detail-item full-width"><label>Languages:</label><div className="tag-list">{selectedApplication.languages?.map(l => <span key={l} className="tag">{l}</span>)}</div></div>
                          <div className="detail-item full-width"><label>Specialties:</label><div className="tag-list">{selectedApplication.specialties?.map(s => <span key={s} className="tag">{s}</span>)}</div></div>
                        </div>
                        <div className="status-update-section">
                          <label>Update Status:</label>
                          <div className="status-buttons">
                            {[['pending', 'Pending'], ['interview', 'Interview'], ['accepted', 'Accept'], ['rejected', 'Reject']].map(([val, label]) => (
                              <button key={val} className={`status-btn ${selectedApplication.status === val ? 'active' : ''}`} onClick={() => setSelectedApplication({ ...selectedApplication, status: val })}>{label}</button>
                            ))}
                          </div>
                          {selectedApplication.status === 'rejected' && (
                            <div className="rejection-reason">
                              <label>Rejection Reason:</label>
                              <textarea placeholder="Why is this application being rejected?" value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} rows="3" />
                            </div>
                          )}
                          {selectedApplication.status === 'accepted' && <div className="success-message small">When accepted, a guide account will be created automatically.</div>}
                          <div className="action-buttons">
                            <button className="btn-primary" onClick={() => handleUpdateApplication(selectedApplication._id, selectedApplication.status)}>Update Status</button>
                            <button className="btn-outline" onClick={() => setSelectedApplication(null)}>Cancel</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TOUR COMPLETIONS TAB */}
            {activeTab === 'completions' && (
              <div className="completions-tab">
                <div className="tab-header">
                  <h3 className="tab-title">Tour Completion Confirmations</h3>
                  <p className="tab-subtitle">Review and confirm tour completions reported by guides</p>
                </div>
                {pendingCompletions.length === 0 ? (
                  <div className="empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    <h3>No Pending Completions</h3>
                    <p>All tour completions have been confirmed.</p>
                  </div>
                ) : (
                  <div className="completions-list">
                    {pendingCompletions.map((assignment) => (
                      <div key={assignment._id} className="completion-card">
                        <div className="completion-card-header">
                          <div>
                            <h3>{assignment.tourName}</h3>
                            <span className="guide-tag">Guide: {assignment.guideName}</span>
                          </div>
                          <span className="pending-badge">Pending Confirmation</span>
                        </div>
                        <div className="completion-details">
                          <div className="completion-detail"><span>Customer:</span><strong>{assignment.customerName}</strong></div>
                          <div className="completion-detail"><span>Start Date:</span><strong>{formatDate(assignment.startDate)}</strong></div>
                          <div className="completion-detail"><span>End Date:</span><strong>{formatDate(assignment.endDate)}</strong></div>
                          <div className="completion-detail"><span>Duration:</span><strong>{assignment.duration} days</strong></div>
                          <div className="completion-detail"><span>Participants:</span><strong>{assignment.participants} people</strong></div>
                          <div className="completion-detail"><span>Reported At:</span><strong>{assignment.guideCompletedAt ? formatDate(assignment.guideCompletedAt) : 'N/A'}</strong></div>
                        </div>
                        {assignment.guideCompletionNote && (
                          <div className="guide-note">
                            <strong>Guide's Note:</strong>
                            <p>{assignment.guideCompletionNote}</p>
                          </div>
                        )}
                        <div className="completion-actions">
                          <button className="btn-primary confirm-btn" onClick={() => handleConfirmCompletion(assignment._id, true)}>
                            Confirm Completed
                          </button>
                          <button className="btn-outline reject-btn" onClick={() => handleConfirmCompletion(assignment._id, false)}>
                            Reject (Set Back to Ongoing)
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* REVIEWS TAB */}
            {activeTab === 'reviews' && (
              <div className="reviews-tab">
                <div className="rt-header">
                  <div>
                    <h3 className="rt-title">Review Moderation</h3>
                    <p className="rt-subtitle">Approve or reject customer reviews before they go public</p>
                  </div>
                  <div className="rt-pills">
                    <span className="rt-pill total">Total: {reviewStats.total}</span>
                    <span className="rt-pill pending">Pending: {reviewStats.pending}</span>
                    <span className="rt-pill approved">Approved: {reviewStats.approved}</span>
                  </div>
                </div>
                {reviews.length === 0 ? (
                  <div className="rt-empty"><div className="rt-empty-icon">★</div><h4>No reviews yet</h4><p>Customer reviews will appear here once submitted</p></div>
                ) : (
                  <div className="rt-grid">
                    {reviews.map(review => (
                      <div key={review._id} className={`rt-card ${review.isApproved ? 'rt-card--approved' : 'rt-card--pending'}`}>
                        <div className="rt-card-top">
                          <div className="rt-avatar">{review.user?.name?.charAt(0)?.toUpperCase() || '?'}</div>
                          <div className="rt-author-info">
                            <span className="rt-author-name">{review.user?.name || 'Anonymous'}</span>
                            <span className="rt-author-email">{review.user?.email || ''}</span>
                          </div>
                          <span className={`rt-status-badge ${review.isApproved ? 'rt-badge--approved' : 'rt-badge--pending'}`}>
                            {review.isApproved ? 'Approved' : 'Pending'}
                          </span>
                        </div>
                        <div className="rt-meta">
                          <div className="rt-stars">{[1,2,3,4,5].map(s => <span key={s} className={s <= review.rating ? 'rt-star filled' : 'rt-star'}>★</span>)}<span className="rt-rating-num">{review.rating}/5</span></div>
                          <span className="rt-tour-tag">{review.tour}</span>
                        </div>
                        <h4 className="rt-review-title">"{review.title}"</h4>
                        <p className="rt-review-body">{review.comment}</p>
                        <div className="rt-card-footer">
                          <span className="rt-date">{new Date(review.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          <div className="rt-actions">
                            {!review.isApproved ? (
                              <button className="rt-btn rt-btn--approve" onClick={() => handleApproveReview(review._id, true)}>Approve</button>
                            ) : (
                              <button className="rt-btn rt-btn--unapprove" onClick={() => handleApproveReview(review._id, false)}>Unapprove</button>
                            )}
                          </div>
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

      {/* Suspend Modal */}
      {suspendModalData && (
        <div className="modal-overlay" onClick={() => setSuspendModalData(null)}>
          <div className="modal-content small" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{suspendModalData.entity.isSuspended ? 'Unsuspend' : 'Suspend'} {suspendModalData.type === 'user' ? 'User' : 'Guide'}</h2>
              <button className="modal-close" onClick={() => setSuspendModalData(null)}>×</button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to {suspendModalData.entity.isSuspended ? 'unsuspend' : 'suspend'} <strong>{suspendModalData.entity.name}</strong>?</p>
              {!suspendModalData.entity.isSuspended && (
                <div className="form-group">
                  <label>Reason for suspension (optional)</label>
                  <input type="text" className="form-input" value={suspendReason} onChange={(e) => setSuspendReason(e.target.value)} placeholder="Enter reason..." />
                </div>
              )}
              {!suspendModalData.entity.isSuspended && (
                <div className="suspend-warning">
                  {suspendModalData.type === 'user' ? 'The user will not be able to book any tours while suspended.' : 'The guide account will be suspended. Their profile will not be publicly visible.'}
                </div>
              )}
              <div className="modal-actions">
                <button className={`btn-${suspendModalData.entity.isSuspended ? 'secondary' : 'danger'}`} onClick={confirmSuspend}>
                  {suspendModalData.entity.isSuspended ? 'Unsuspend Account' : 'Suspend Account'}
                </button>
                <button className="btn-outline" onClick={() => setSuspendModalData(null)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
