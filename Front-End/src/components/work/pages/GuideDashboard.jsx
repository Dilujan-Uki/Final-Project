// src/pages/GuideDashboard.jsx - FIXED version
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './GuideDashboard.css';

const GuideDashboard = () => {
  const [guide, setGuide] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [stats, setStats] = useState({
    totalEarnings: 0,
    completedTours: 0,
    upcomingTours: 0,
    ongoingTours: 0,
    totalCustomers: 0,
    averageRating: 0,
    monthlyEarnings: 0
  });
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [profileForm, setProfileForm] = useState({
    phone: '',
    bio: '',
    languages: [],
    specialties: [],
    hourlyRate: 0,
    dailyRate: 0,
    availability: ''
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const navigate = useNavigate();

  // Define calculateStats with useCallback
  const calculateStats = useCallback((assignmentsData) => {
    const completed = assignmentsData.filter(a => a.status === 'completed');
    const upcoming = assignmentsData.filter(a => a.status === 'upcoming');
    const ongoing = assignmentsData.filter(a => a.status === 'ongoing');
    
    // Calculate earnings (assuming $70 per day for completed tours)
    const earnings = completed.reduce((sum, a) => sum + (a.duration * 70), 0);
    
    // Get current month's earnings
    const currentMonth = new Date().getMonth();
    const monthlyEarnings = completed
      .filter(a => new Date(a.startDate).getMonth() === currentMonth)
      .reduce((sum, a) => sum + (a.duration * 70), 0);

    // Count unique customers
    const uniqueCustomers = new Set(completed.map(a => a.customerEmail)).size;

    setStats({
      totalEarnings: earnings,
      completedTours: completed.length,
      upcomingTours: upcoming.length,
      ongoingTours: ongoing.length,
      totalCustomers: uniqueCustomers,
      averageRating: guide?.rating || 4.8,
      monthlyEarnings: monthlyEarnings
    });
  }, [guide?.rating]); // Add guide?.rating as dependency

  // Define fetchAssignments with useCallback - now includes calculateStats in dependencies
  const fetchAssignments = useCallback(async () => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch('http://localhost:5000/api/guides/assignments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.status === 'success') {
        setAssignments(data.data);
        calculateStats(data.data); // This now has calculateStats in dependencies
      } else {
        setError('Failed to fetch assignments');
      }
    } catch (err) {
      setError('Error loading assignments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [calculateStats]); // Add calculateStats as dependency

  // Define fetchGuideProfile with useCallback
  const fetchGuideProfile = useCallback(async () => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch('http://localhost:5000/api/guides/profile/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.status === 'success') {
        setGuide(data.data);
        setProfileForm({
          phone: data.data.phone || '',
          bio: data.data.bio || '',
          languages: data.data.languages || [],
          specialties: data.data.specialties || [],
          hourlyRate: data.data.hourlyRate || 20,
          dailyRate: data.data.dailyRate || 70,
          availability: data.data.availability || 'Available for bookings 7 days a week'
        });
      }
    } catch (err) {
      console.error('Error fetching guide profile:', err);
    }
  }, []);

  // Update useEffect with proper dependencies
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || user.role !== 'guide') {
      navigate('/login');
      return;
    }

    fetchGuideProfile();
    fetchAssignments();
  }, [navigate, fetchGuideProfile, fetchAssignments]);

  const updateStatus = async (assignmentId, newStatus) => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`http://localhost:5000/api/guides/assignments/${assignmentId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (data.status === 'success') {
        alert(`✅ Assignment marked as ${newStatus}`);
        fetchAssignments(); // Refresh
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const updateProfile = async () => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch('http://localhost:5000/api/guides/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileForm)
      });

      const data = await response.json();

      if (data.status === 'success') {
        setUpdateSuccess(true);
        setShowProfileEdit(false);
        fetchGuideProfile();
        setTimeout(() => setUpdateSuccess(false), 3000);
      }
    } catch (err) {
      alert('Failed to update profile');
    }
  };

  const handleLanguageToggle = (language) => {
    setProfileForm(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  const handleSpecialtyToggle = (specialty) => {
    setProfileForm(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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

  const getFilteredAssignments = () => {
    if (activeTab === 'all') return assignments;
    return assignments.filter(a => a.status === activeTab);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return '#ffc107';
      case 'ongoing': return '#17a2b8';
      case 'completed': return '#28a745';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  if (loading) {
    return (
      <div className="loading-page">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  // Rest of your JSX remains exactly the same...
  return (
    <div className="guide-dashboard">
      <div className="container">
        {/* Header with Guide Info */}
        <div className="guide-header">
          <div className="guide-header-content">
            <div className="guide-avatar-large">
              {guide?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="guide-header-info">
              <h1 className="guide-title">Welcome, {guide?.name?.split(' ')[0]}! 👋</h1>
              <p className="guide-subtitle">{guide?.email}</p>
              <div className="guide-rating-badge">
                <span className="stars">{'★'.repeat(Math.floor(guide?.rating || 0))}</span>
                <span className="rating-text">{guide?.rating.toFixed(1)} • {guide?.totalReviews || 0} reviews</span>
              </div>
            </div>
            <button 
              className="edit-profile-btn"
              onClick={() => setShowProfileEdit(true)}
            >
              ✏️ Edit Profile
            </button>
          </div>
        </div>

        {/* Success Message */}
        {updateSuccess && (
          <div className="success-message">
            ✅ Profile updated successfully!
          </div>
        )}

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3 className="stat-value">{formatCurrency(stats.totalEarnings)}</h3>
              <p className="stat-label">Total Earnings</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.completedTours}</h3>
              <p className="stat-label">Completed Tours</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.upcomingTours}</h3>
              <p className="stat-label">Upcoming</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔄</div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.ongoingTours || 0}</h3>
              <p className="stat-label">Ongoing</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.totalCustomers}</h3>
              <p className="stat-label">Happy Customers</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.averageRating}</h3>
              <p className="stat-label">Average Rating</p>
            </div>
          </div>
        </div>

        {/* Monthly Earnings Card */}
        <div className="monthly-earnings-card">
          <div className="earnings-header">
            <h3>This Month's Earnings</h3>
            <span className="earnings-amount">{formatCurrency(stats.monthlyEarnings)}</span>
          </div>
          <div className="earnings-progress">
            <div 
              className="progress-bar" 
              style={{ width: `${Math.min((stats.monthlyEarnings / 2000) * 100, 100)}%` }}
            ></div>
          </div>
          <p className="earnings-target">Target: $2,000</p>
        </div>

        {/* Tabs */}
        <div className="dashboard-tabs">
          <button
            className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            📅 Upcoming ({stats.upcomingTours})
          </button>
          <button
            className={`tab-btn ${activeTab === 'ongoing' ? 'active' : ''}`}
            onClick={() => setActiveTab('ongoing')}
          >
            🔄 Ongoing ({stats.ongoingTours || 0})
          </button>
          <button
            className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            ✅ Completed ({stats.completedTours})
          </button>
          <button
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            📋 All ({assignments.length})
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* Assignments Grid */}
        {getFilteredAssignments().length === 0 ? (
          <div className="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <h3>No {activeTab} assignments</h3>
            <p>You don't have any {activeTab} tours at the moment.</p>
          </div>
        ) : (
          <div className="assignments-grid">
            {getFilteredAssignments().map((assignment) => (
              <div key={assignment._id} className="assignment-card">
                <div className="assignment-header">
                  <div>
                    <h3 className="tour-name">{assignment.tourName}</h3>
                    <span className="assignment-id">ID: {assignment._id.slice(-6).toUpperCase()}</span>
                  </div>
                  <span className={`status-badge ${assignment.status}`} style={{backgroundColor: getStatusColor(assignment.status) + '20', color: getStatusColor(assignment.status)}}>
                    {assignment.status === 'upcoming' ? '📅 Booked' : assignment.status}
                  </span>
                </div>

                <div className="customer-info">
                  <h4>
                    <span className="customer-icon">👤</span>
                    Customer Details
                  </h4>
                  <div className="customer-details-grid">
                    <div className="detail-item">
                      <span className="detail-label">Name:</span>
                      <span className="detail-value">{assignment.customerName}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">{assignment.customerEmail}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Phone:</span>
                      <span className="detail-value">{assignment.customerPhone || 'Not provided'}</span>
                    </div>
                  </div>
                </div>

                <div className="tour-details">
                  <div className="detail-row">
                    <span>📅 Start:</span>
                    <strong>{formatDate(assignment.startDate)}</strong>
                  </div>
                  <div className="detail-row">
                    <span>📅 End:</span>
                    <strong>{formatDate(assignment.endDate)}</strong>
                  </div>
                  <div className="detail-row">
                    <span>👥 Group:</span>
                    <strong>{assignment.participants} people</strong>
                  </div>
                  <div className="detail-row">
                    <span>⏱️ Duration:</span>
                    <strong>{assignment.duration} days</strong>
                  </div>
                  {assignment.status === 'completed' && (
                    <div className="detail-row earnings">
                      <span>💰 Earnings:</span>
                      <strong>{formatCurrency(assignment.duration * 70)}</strong>
                    </div>
                  )}
                </div>

                {assignment.specialRequests && (
                  <div className="special-requests">
                    <strong>📝 Special Requests:</strong>
                    <p>{assignment.specialRequests}</p>
                  </div>
                )}

                <div className="assignment-actions">
                  {assignment.status === 'upcoming' && (
                    <>
                      <button 
                        onClick={() => updateStatus(assignment._id, 'ongoing')}
                        className="btn-primary start-btn"
                      >
                        🚀 Start Tour
                      </button>
                      <button 
                        onClick={() => window.location.href = `mailto:${assignment.customerEmail}`}
                        className="btn-outline contact-btn"
                      >
                        📧 Contact
                      </button>
                    </>
                  )}
                  {assignment.status === 'ongoing' && (
                    <>
                      <button 
                        onClick={() => updateStatus(assignment._id, 'completed')}
                        className="btn-secondary complete-btn"
                      >
                        ✅ Mark Complete
                      </button>
                      <button 
                        onClick={() => window.location.href = `tel:${assignment.customerPhone}`}
                        className="btn-outline call-btn"
                        disabled={!assignment.customerPhone}
                      >
                        📞 Call
                      </button>
                    </>
                  )}
                  {assignment.status === 'completed' && (
                    <button 
                      onClick={() => setSelectedAssignment(assignment)}
                      className="btn-outline view-btn"
                    >
                      👁️ View Summary
                    </button>
                  )}
                  {assignment.status === 'upcoming' && (
                    <button 
                      onClick={() => setSelectedAssignment(assignment)}
                      className="btn-outline details-btn"
                    >
                      📋 Details
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Details Modal */}
        {selectedAssignment && (
          <div className="modal-overlay" onClick={() => setSelectedAssignment(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Assignment Details</h2>
                <button className="modal-close" onClick={() => setSelectedAssignment(null)}>×</button>
              </div>
              <div className="modal-body">
                <div className="modal-tour-header">
                  <h3>{selectedAssignment.tourName}</h3>
                  <span className={`status-badge ${selectedAssignment.status}`}>
                    {selectedAssignment.status}
                  </span>
                </div>
                
                <div className="detail-section">
                  <h4>👤 Customer Information</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Name:</span>
                      <span className="detail-value">{selectedAssignment.customerName}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">{selectedAssignment.customerEmail}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Phone:</span>
                      <span className="detail-value">{selectedAssignment.customerPhone || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>📅 Tour Schedule</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Start Date:</span>
                      <span className="detail-value">{formatDate(selectedAssignment.startDate)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">End Date:</span>
                      <span className="detail-value">{formatDate(selectedAssignment.endDate)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Duration:</span>
                      <span className="detail-value">{selectedAssignment.duration} days</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Participants:</span>
                      <span className="detail-value">{selectedAssignment.participants}</span>
                    </div>
                  </div>
                </div>

                {selectedAssignment.specialRequests && (
                  <div className="detail-section">
                    <h4>📝 Special Requests</h4>
                    <p className="requests-text">{selectedAssignment.specialRequests}</p>
                  </div>
                )}

                <div className="detail-section">
                  <h4>📍 Meeting Point</h4>
                  <p className="meeting-point">{selectedAssignment.meetingPoint}</p>
                </div>

                {selectedAssignment.status === 'completed' && (
                  <div className="detail-section earnings-section">
                    <h4>💰 Earnings</h4>
                    <p className="earnings-amount">{formatCurrency(selectedAssignment.duration * 70)}</p>
                    <p className="earnings-note">* Based on daily rate of $70</p>
                  </div>
                )}

                <div className="modal-actions">
                  <button 
                    className="btn-primary"
                    onClick={() => window.location.href = `mailto:${selectedAssignment.customerEmail}`}
                  >
                    📧 Email Customer
                  </button>
                  {selectedAssignment.customerPhone && (
                    <button 
                      className="btn-secondary"
                      onClick={() => window.location.href = `tel:${selectedAssignment.customerPhone}`}
                    >
                      📞 Call Customer
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Edit Modal */}
        {showProfileEdit && (
          <div className="modal-overlay" onClick={() => setShowProfileEdit(false)}>
            <div className="modal-content large" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Edit Profile</h2>
                <button className="modal-close" onClick={() => setShowProfileEdit(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="profile-edit-form">
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                      placeholder="+94 77 123 4567"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Bio</label>
                    <textarea
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                      placeholder="Tell customers about yourself..."
                      rows="4"
                      className="form-textarea"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Hourly Rate ($)</label>
                      <input
                        type="number"
                        value={profileForm.hourlyRate}
                        onChange={(e) => setProfileForm({...profileForm, hourlyRate: parseInt(e.target.value)})}
                        min="10"
                        max="100"
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Daily Rate ($)</label>
                      <input
                        type="number"
                        value={profileForm.dailyRate}
                        onChange={(e) => setProfileForm({...profileForm, dailyRate: parseInt(e.target.value)})}
                        min="50"
                        max="500"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Availability</label>
                    <input
                      type="text"
                      value={profileForm.availability}
                      onChange={(e) => setProfileForm({...profileForm, availability: e.target.value})}
                      placeholder="e.g., Available 7 days a week"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Languages</label>
                    <div className="checkbox-group">
                      {['English', 'Sinhala', 'Tamil', 'French', 'German', 'Japanese', 'Chinese', 'Russian'].map(lang => (
                        <label key={lang} className="checkbox">
                          <input
                            type="checkbox"
                            checked={profileForm.languages.includes(lang)}
                            onChange={() => handleLanguageToggle(lang)}
                          />
                          {lang}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Specialties</label>
                    <div className="checkbox-group">
                      {[
                        'Cultural Heritage', 'Wildlife', 'Adventure', 
                        'Beach Tours', 'Photography', 'History', 
                        'Food & Cuisine', 'Hiking', 'Temple Tours'
                      ].map(spec => (
                        <label key={spec} className="checkbox">
                          <input
                            type="checkbox"
                            checked={profileForm.specialties.includes(spec)}
                            onChange={() => handleSpecialtyToggle(spec)}
                          />
                          {spec}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-actions">
                    <button className="btn-primary" onClick={updateProfile}>
                      Save Changes
                    </button>
                    <button className="btn-outline" onClick={() => setShowProfileEdit(false)}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuideDashboard;