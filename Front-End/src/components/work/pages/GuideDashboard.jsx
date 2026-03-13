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
  const [stats, setStats] = useState({ totalEarnings: 0, completedTours: 0, upcomingTours: 0, ongoingTours: 0, totalCustomers: 0, averageRating: 0, monthlyEarnings: 0 });
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [profileForm, setProfileForm] = useState({ phone: '', bio: '', languages: [], specialties: [], dailyRate: 0, availability: '' });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completionNote, setCompletionNote] = useState('');
  const [completingAssignment, setCompletingAssignment] = useState(null);
  // Change password modal
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [pwForm, setPwForm] = useState({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
  const [showOldPw, setShowOldPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwError, setPwError] = useState('');
  const navigate = useNavigate();

  const calculateStats = useCallback((assignmentsData) => {
    const completed = assignmentsData.filter(a => a.status === 'completed');
    const upcoming = assignmentsData.filter(a => a.status === 'upcoming');
    const ongoing = assignmentsData.filter(a => a.status === 'ongoing');
    const earnings = completed.reduce((sum, a) => sum + (a.duration * 70), 0);
    const currentMonth = new Date().getMonth();
    const monthlyEarnings = completed.filter(a => new Date(a.startDate).getMonth() === currentMonth).reduce((sum, a) => sum + (a.duration * 70), 0);
    const uniqueCustomers = new Set(completed.map(a => a.customerEmail)).size;
    setStats({ totalEarnings: earnings, completedTours: completed.length, upcomingTours: upcoming.length, ongoingTours: ongoing.length, totalCustomers: uniqueCustomers, averageRating: 0, monthlyEarnings });
  }, []);

  const fetchAssignments = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/guides/assignments', { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await response.json();
      if (data.status === 'success') { setAssignments(data.data); calculateStats(data.data); }
      else setError('Failed to fetch assignments');
    } catch (err) { setError('Error loading assignments'); }
    finally { setLoading(false); }
  }, [calculateStats]);

  const fetchGuideProfile = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/guides/profile/me', { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await response.json();
      if (data.status === 'success') {
        setGuide(data.data);
        setStats(prev => ({ ...prev, averageRating: data.data.rating || 0 }));
        setProfileForm({ phone: data.data.phone || '', bio: data.data.bio || '', languages: data.data.languages || [], specialties: data.data.specialties || [], dailyRate: data.data.dailyRate || 70, availability: data.data.availability || '' });
      }
    } catch (err) { console.error('Error fetching guide profile:', err); }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!token || user.role !== 'guide') { navigate('/login'); return; }
    fetchGuideProfile();
    fetchAssignments();
  }, [navigate, fetchGuideProfile, fetchAssignments]);

  const updateStatus = async (assignmentId, newStatus, note = '') => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/guides/assignments/${assignmentId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus, completionNote: note })
      });
      const data = await response.json();
      if (data.status === 'success') {
        fetchAssignments();
        setShowCompletionModal(false);
        setCompletionNote('');
        setCompletingAssignment(null);
        if (newStatus === 'completed') {
          alert('Tour completion reported! The admin will review and confirm it.');
        }
      }
    } catch (err) { alert('Failed to update status'); }
  };

  const handleStartTour = async (assignment) => {
    if (window.confirm(`Start the tour "${assignment.tourName}" now? This will notify the customer.`)) {
      await updateStatus(assignment._id, 'ongoing');
    }
  };

  const handleReportCompletion = (assignment) => {
    setCompletingAssignment(assignment);
    setShowCompletionModal(true);
  };

  const updateProfile = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/guides/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(profileForm)
      });
      const data = await response.json();
      if (data.status === 'success') { setUpdateSuccess(true); setShowProfileEdit(false); fetchGuideProfile(); setTimeout(() => setUpdateSuccess(false), 3000); }
      else alert('Failed to update profile');
    } catch (err) { alert('Failed to update profile'); }
  };

  const handleLanguageToggle = (lang) => {
    setProfileForm(prev => ({ ...prev, languages: prev.languages.includes(lang) ? prev.languages.filter(l => l !== lang) : [...prev.languages, lang] }));
  };

  const handleSpecialtyToggle = (spec) => {
    setProfileForm(prev => ({ ...prev, specialties: prev.specialties.includes(spec) ? prev.specialties.filter(s => s !== spec) : [...prev.specialties, spec] }));
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const formatCurrency = (a) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(a);
  const getFilteredAssignments = () => activeTab === 'all' ? assignments : assignments.filter(a => a.status === activeTab);

  if (loading) return (
    <div className="loading-page">
      <div className="loading-spinner"></div>
      <p>Loading your dashboard...</p>
    </div>
  );

  const isSuspended = guide?.isSuspended;

  const EyeIcon = ({ open }) =>
    open ? (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    );

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess('');
    if (pwForm.newPassword.length < 6) { setPwError('New password must be at least 6 characters.'); return; }
    if (pwForm.newPassword !== pwForm.confirmNewPassword) { setPwError('New passwords do not match.'); return; }
    setPwLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ oldPassword: pwForm.oldPassword, newPassword: pwForm.newPassword })
      });
      const data = await response.json();
      if (data.status === 'success') {
        setPwSuccess('Password changed successfully!');
        setPwForm({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
        setTimeout(() => { setPwSuccess(''); }, 4000);
      } else {
        setPwError(data.message || 'Failed to change password.');
      }
    } catch { setPwError('Network error. Please try again.'); }
    finally { setPwLoading(false); }
  };

  return (
    <div className="guide-dashboard">
      <div className="container">

        {isSuspended && (
          <div className="suspension-banner">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Your account has been suspended. {guide?.suspendedReason && `Reason: ${guide.suspendedReason}`} Please contact admin for assistance.
          </div>
        )}

        <div className="guide-header">
          <div className="guide-header-content">
            <div className="guide-avatar-large">{guide?.name?.charAt(0).toUpperCase()}</div>
            <div className="guide-header-info">
              <h1 className="guide-title">Welcome, {guide?.name?.split(' ')[0]}!</h1>
              <p className="guide-subtitle">{guide?.email}</p>
              <div className="guide-rating-badge">
                <span className="stars">{'★'.repeat(Math.floor(guide?.rating || 0))}</span>
                <span className="rating-text">{(guide?.rating || 0).toFixed(1)} &bull; {guide?.totalReviews || 0} reviews</span>
              </div>
            </div>
            <div className="guide-header-actions">
              <button className="edit-profile-btn" onClick={() => setShowProfileEdit(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"/><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"/></svg>
                Edit Profile
              </button>
              <button className="change-pw-btn" onClick={() => setShowChangePassword(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Change Password
              </button>
            </div>
          </div>
        </div>

        {updateSuccess && <div className="success-message">Profile updated successfully!</div>}

        <div className="stats-grid">
          {[
            { label: 'Total Earnings', value: formatCurrency(stats.totalEarnings) },
            { label: 'Completed Tours', value: stats.completedTours },
            { label: 'Upcoming', value: stats.upcomingTours },
            { label: 'Ongoing', value: stats.ongoingTours || 0 },
            { label: 'Happy Customers', value: stats.totalCustomers },
            { label: 'Avg Rating', value: (stats.averageRating || 0).toFixed(1) },
          ].map(({ label, value }) => (
            <div key={label} className="stat-card">
              <div className="stat-content">
                <h3 className="stat-value">{value}</h3>
                <p className="stat-label">{label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="monthly-earnings-card">
          <div className="earnings-header">
            <h3>This Month's Earnings</h3>
            <span className="earnings-amount">{formatCurrency(stats.monthlyEarnings)}</span>
          </div>
          <div className="earnings-progress">
            <div className="progress-bar" style={{ width: `${Math.min((stats.monthlyEarnings / 2000) * 100, 100)}%` }}></div>
          </div>
          <p className="earnings-target">Target: $2,000</p>
        </div>

        <div className="dashboard-tabs">
          {[['upcoming','Upcoming'], ['ongoing','Ongoing'], ['completed','Completed'], ['all','All']].map(([tab, label]) => (
            <button key={tab} className={`tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
              {label} ({tab === 'all' ? assignments.length : assignments.filter(a => a.status === tab).length})
            </button>
          ))}
        </div>

        {error && <div className="error-message">{error}</div>}

        {getFilteredAssignments().length === 0 ? (
          <div className="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
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
                    <span className="assignment-id">#{assignment._id.slice(-6).toUpperCase()}</span>
                  </div>
                  <span className={`status-badge status-${assignment.status}${assignment.guideMarkedCompleted && !assignment.adminConfirmedCompleted ? ' pending-confirm' : ''}`}>
                    {assignment.guideMarkedCompleted && !assignment.adminConfirmedCompleted ? 'Pending Confirmation' : assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                  </span>
                </div>

                <div className="customer-info">
                  <h4>Customer Details</h4>
                  <div className="customer-details-grid">
                    <div className="detail-item"><span className="detail-label">Name:</span><span className="detail-value">{assignment.customerName}</span></div>
                    <div className="detail-item"><span className="detail-label">Email:</span><span className="detail-value">{assignment.customerEmail}</span></div>
                    <div className="detail-item"><span className="detail-label">Phone:</span><span className="detail-value">{assignment.customerPhone || 'Not provided'}</span></div>
                  </div>
                </div>

                <div className="tour-details">
                  <div className="detail-row"><span>Start:</span><strong>{formatDate(assignment.startDate)}</strong></div>
                  <div className="detail-row"><span>End:</span><strong>{formatDate(assignment.endDate)}</strong></div>
                  <div className="detail-row"><span>Group:</span><strong>{assignment.participants} people</strong></div>
                  <div className="detail-row"><span>Duration:</span><strong>{assignment.duration} days</strong></div>
                  {assignment.status === 'completed' && (
                    <div className="detail-row earnings-row"><span>Earnings:</span><strong>{formatCurrency(assignment.duration * 70)}</strong></div>
                  )}
                </div>

                {assignment.specialRequests && (
                  <div className="special-requests"><strong>Special Requests:</strong><p>{assignment.specialRequests}</p></div>
                )}

                {assignment.guideMarkedCompleted && !assignment.adminConfirmedCompleted && (
                  <div className="completion-pending-notice">
                    Tour completion reported. Awaiting admin confirmation.
                    {assignment.guideCompletionNote && <p>Note: {assignment.guideCompletionNote}</p>}
                  </div>
                )}

                <div className="assignment-actions">
                  {assignment.status === 'upcoming' && (
                    <>
                      <button onClick={() => handleStartTour(assignment)} className="btn-primary start-btn">Start Tour</button>
                      <button onClick={() => setSelectedAssignment(assignment)} className="btn-outline details-btn">Details</button>
                    </>
                  )}
                  {assignment.status === 'ongoing' && !assignment.guideMarkedCompleted && (
                    <>
                      <button onClick={() => handleReportCompletion(assignment)} className="btn-secondary complete-btn">Report Completion</button>
                      <button onClick={() => window.location.href = `tel:${assignment.customerPhone}`} className="btn-outline call-btn" disabled={!assignment.customerPhone}>Call Customer</button>
                    </>
                  )}
                  {assignment.status === 'ongoing' && assignment.guideMarkedCompleted && !assignment.adminConfirmedCompleted && (
                    <button className="btn-outline disabled-btn" disabled>Awaiting Admin Confirmation</button>
                  )}
                  {assignment.status === 'completed' && (
                    <button onClick={() => setSelectedAssignment(assignment)} className="btn-outline view-btn">View Summary</button>
                  )}
                  {assignment.status === 'upcoming' && (
                    <button onClick={() => window.location.href = `mailto:${assignment.customerEmail}`} className="btn-outline contact-btn">Contact Customer</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Completion Report Modal */}
        {showCompletionModal && completingAssignment && (
          <div className="modal-overlay" onClick={() => setShowCompletionModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Report Tour Completion</h2>
                <button className="modal-close" onClick={() => setShowCompletionModal(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="completion-info">
                  <p>You are reporting completion for:</p>
                  <h3>{completingAssignment.tourName}</h3>
                  <p>Customer: {completingAssignment.customerName}</p>
                </div>
                <div className="form-group">
                  <label>Completion Notes (optional)</label>
                  <textarea
                    value={completionNote}
                    onChange={(e) => setCompletionNote(e.target.value)}
                    placeholder="Add any notes about the tour completion..."
                    rows="4"
                    className="form-textarea"
                  />
                </div>
                <p className="completion-notice">The admin will review and confirm the completion. Once confirmed, the booking will be marked as completed.</p>
                <div className="modal-actions">
                  <button className="btn-primary" onClick={() => updateStatus(completingAssignment._id, 'completed', completionNote)}>Submit Report</button>
                  <button className="btn-outline" onClick={() => setShowCompletionModal(false)}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Assignment Details Modal */}
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
                  <span className={`status-badge status-${selectedAssignment.status}`}>{selectedAssignment.status}</span>
                </div>
                <div className="detail-section">
                  <h4>Customer Information</h4>
                  <div className="detail-grid">
                    <div className="detail-item"><span className="detail-label">Name:</span><span className="detail-value">{selectedAssignment.customerName}</span></div>
                    <div className="detail-item"><span className="detail-label">Email:</span><span className="detail-value">{selectedAssignment.customerEmail}</span></div>
                    <div className="detail-item"><span className="detail-label">Phone:</span><span className="detail-value">{selectedAssignment.customerPhone || 'N/A'}</span></div>
                  </div>
                </div>
                <div className="detail-section">
                  <h4>Tour Schedule</h4>
                  <div className="detail-grid">
                    <div className="detail-item"><span className="detail-label">Start Date:</span><span className="detail-value">{formatDate(selectedAssignment.startDate)}</span></div>
                    <div className="detail-item"><span className="detail-label">End Date:</span><span className="detail-value">{formatDate(selectedAssignment.endDate)}</span></div>
                    <div className="detail-item"><span className="detail-label">Duration:</span><span className="detail-value">{selectedAssignment.duration} days</span></div>
                    <div className="detail-item"><span className="detail-label">Participants:</span><span className="detail-value">{selectedAssignment.participants}</span></div>
                  </div>
                </div>
                {selectedAssignment.specialRequests && (
                  <div className="detail-section"><h4>Special Requests</h4><p className="requests-text">{selectedAssignment.specialRequests}</p></div>
                )}
                <div className="detail-section"><h4>Meeting Point</h4><p className="meeting-point">{selectedAssignment.meetingPoint}</p></div>
                {selectedAssignment.status === 'completed' && (
                  <div className="detail-section earnings-section">
                    <h4>Earnings</h4>
                    <p className="earnings-amount">{formatCurrency(selectedAssignment.duration * 70)}</p>
                    <p className="earnings-note">Based on daily rate of $70</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Change Password Modal */}
        {showChangePassword && (
          <div className="modal-overlay" onClick={() => { setShowChangePassword(false); setPwError(''); setPwSuccess(''); }}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
              <div className="modal-header">
                <h2>🔒 Change Password</h2>
                <button className="modal-close" onClick={() => { setShowChangePassword(false); setPwError(''); setPwSuccess(''); }}>×</button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {pwSuccess && <div className="success-message" style={{ marginBottom: 0 }}>✅ {pwSuccess}</div>}
                  {pwError && <div style={{ background: '#f8d7da', color: '#721c24', padding: '0.9rem 1.2rem', borderRadius: '10px', fontSize: '0.9rem' }}>❌ {pwError}</div>}

                  <div className="form-group">
                    <label>🔑 Current Password</label>
                    <div className="pw-input-wrapper">
                      <input
                        type={showOldPw ? 'text' : 'password'}
                        value={pwForm.oldPassword}
                        onChange={e => setPwForm(p => ({ ...p, oldPassword: e.target.value }))}
                        className="form-input" placeholder="Enter your current password"
                        required disabled={pwLoading}
                      />
                      <button type="button" className="pw-toggle-btn" onClick={() => setShowOldPw(v => !v)} tabIndex={-1}>
                        <EyeIcon open={showOldPw} />
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>🔒 New Password</label>
                    <div className="pw-input-wrapper">
                      <input
                        type={showNewPw ? 'text' : 'password'}
                        value={pwForm.newPassword}
                        onChange={e => setPwForm(p => ({ ...p, newPassword: e.target.value }))}
                        className="form-input" placeholder="Min. 6 characters"
                        required minLength="6" disabled={pwLoading}
                      />
                      <button type="button" className="pw-toggle-btn" onClick={() => setShowNewPw(v => !v)} tabIndex={-1}>
                        <EyeIcon open={showNewPw} />
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>🔒 Confirm New Password</label>
                    <div className="pw-input-wrapper">
                      <input
                        type={showConfirmPw ? 'text' : 'password'}
                        value={pwForm.confirmNewPassword}
                        onChange={e => setPwForm(p => ({ ...p, confirmNewPassword: e.target.value }))}
                        className="form-input" placeholder="Re-enter new password"
                        required disabled={pwLoading}
                      />
                      <button type="button" className="pw-toggle-btn" onClick={() => setShowConfirmPw(v => !v)} tabIndex={-1}>
                        <EyeIcon open={showConfirmPw} />
                      </button>
                    </div>
                    {pwForm.newPassword && pwForm.confirmNewPassword && (
                      <small style={{ marginTop: '0.35rem', display: 'block', fontSize: '0.8rem', color: pwForm.newPassword === pwForm.confirmNewPassword ? '#155724' : '#721c24' }}>
                        {pwForm.newPassword === pwForm.confirmNewPassword ? '✅ Passwords match' : '❌ Passwords do not match'}
                      </small>
                    )}
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn-primary" disabled={pwLoading}>
                      {pwLoading ? 'Updating...' : '🔒 Update Password'}
                    </button>
                    <button type="button" className="btn-outline" onClick={() => { setShowChangePassword(false); setPwError(''); setPwSuccess(''); }}>
                      Cancel
                    </button>
                  </div>
                </form>
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
                    <input type="tel" value={profileForm.phone} onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})} placeholder="+94 77 123 4567" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label>Bio</label>
                    <textarea value={profileForm.bio} onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})} placeholder="Tell customers about yourself..." rows="4" className="form-textarea" />
                  </div>
                  <div className="form-group">
                    <label>Availability</label>
                    <input type="text" value={profileForm.availability} onChange={(e) => setProfileForm({...profileForm, availability: e.target.value})} placeholder="e.g., Available 7 days a week" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label>Languages</label>
                    <div className="checkbox-group">
                      {['English', 'Sinhala', 'Tamil', 'French', 'German', 'Japanese', 'Chinese', 'Russian'].map(lang => (
                        <label key={lang} className="checkbox">
                          <input type="checkbox" checked={profileForm.languages.includes(lang)} onChange={() => handleLanguageToggle(lang)} />
                          {lang}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Specialties</label>
                    <div className="checkbox-group">
                      {['Cultural Heritage', 'Wildlife', 'Adventure', 'Beach Tours', 'Photography', 'History', 'Food & Cuisine', 'Hiking', 'Temple Tours'].map(spec => (
                        <label key={spec} className="checkbox">
                          <input type="checkbox" checked={profileForm.specialties.includes(spec)} onChange={() => handleSpecialtyToggle(spec)} />
                          {spec}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="form-actions">
                    <button className="btn-primary" onClick={updateProfile}>Save Changes</button>
                    <button className="btn-outline" onClick={() => setShowProfileEdit(false)}>Cancel</button>
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