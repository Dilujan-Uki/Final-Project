// src/pages/GuideDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './GuideDashboard.css';

const GuideDashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || user.role !== 'guide') {
      navigate('/login');
      return;
    }

    fetchAssignments();
  }, [navigate]);

  const fetchAssignments = async () => {
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
      } else {
        setError('Failed to fetch assignments');
      }
    } catch (err) {
      setError('Error loading assignments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading-page">
        <div className="loading-spinner"></div>
        <p>Loading your assignments...</p>
      </div>
    );
  }

  return (
    <div className="guide-dashboard">
      <div className="container">
        <div className="guide-header">
          <h1 className="guide-title">My Tour Guide Dashboard</h1>
          <p className="guide-subtitle">View your upcoming and past tour assignments</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {assignments.length === 0 ? (
          <div className="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <h3>No Assignments Yet</h3>
            <p>You haven't been assigned to any tours. Check back later!</p>
          </div>
        ) : (
          <div className="assignments-grid">
            {assignments.map((assignment) => (
              <div key={assignment._id} className="assignment-card">
                <div className="assignment-header">
                  <h3 className="tour-name">{assignment.tourName}</h3>
                  <span className={`status-badge ${assignment.status}`}>
                    {assignment.status}
                  </span>
                </div>

                <div className="customer-info">
                  <h4>Customer Details</h4>
                  <p><strong>Name:</strong> {assignment.customerName}</p>
                  <p><strong>Email:</strong> {assignment.customerEmail}</p>
                  <p><strong>Phone:</strong> {assignment.customerPhone || 'Not provided'}</p>
                </div>

                <div className="tour-details">
                  <div className="detail-row">
                    <span>📅 Start Date:</span>
                    <strong>{formatDate(assignment.startDate)}</strong>
                  </div>
                  <div className="detail-row">
                    <span>📅 End Date:</span>
                    <strong>{formatDate(assignment.endDate)}</strong>
                  </div>
                  <div className="detail-row">
                    <span>👥 Participants:</span>
                    <strong>{assignment.participants}</strong>
                  </div>
                  <div className="detail-row">
                    <span>⏱️ Duration:</span>
                    <strong>{assignment.duration} days</strong>
                  </div>
                </div>

                {assignment.specialRequests && (
                  <div className="special-requests">
                    <strong>Special Requests:</strong>
                    <p>{assignment.specialRequests}</p>
                  </div>
                )}

                <div className="assignment-actions">
                  {assignment.status === 'upcoming' && (
                    <button 
                      onClick={() => updateStatus(assignment._id, 'ongoing')}
                      className="btn-primary"
                    >
                      Start Tour
                    </button>
                  )}
                  {assignment.status === 'ongoing' && (
                    <button 
                      onClick={() => updateStatus(assignment._id, 'completed')}
                      className="btn-secondary"
                    >
                      Mark as Completed
                    </button>
                  )}
                  <button 
                    onClick={() => setSelectedAssignment(assignment)}
                    className="btn-outline"
                  >
                    View Details
                  </button>
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
                <h3>{selectedAssignment.tourName}</h3>
                
                <div className="detail-section">
                  <h4>Customer Information</h4>
                  <p><strong>Name:</strong> {selectedAssignment.customerName}</p>
                  <p><strong>Email:</strong> {selectedAssignment.customerEmail}</p>
                  <p><strong>Phone:</strong> {selectedAssignment.customerPhone || 'N/A'}</p>
                </div>

                <div className="detail-section">
                  <h4>Tour Details</h4>
                  <p><strong>Start Date:</strong> {formatDate(selectedAssignment.startDate)}</p>
                  <p><strong>End Date:</strong> {formatDate(selectedAssignment.endDate)}</p>
                  <p><strong>Participants:</strong> {selectedAssignment.participants}</p>
                  <p><strong>Duration:</strong> {selectedAssignment.duration} days</p>
                </div>

                {selectedAssignment.specialRequests && (
                  <div className="detail-section">
                    <h4>Special Requests</h4>
                    <p>{selectedAssignment.specialRequests}</p>
                  </div>
                )}

                <div className="detail-section">
                  <h4>Meeting Point</h4>
                  <p>{selectedAssignment.meetingPoint}</p>
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