// src/components/work/pages/GuideDetail.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookingForm from '../common/BookingForm';
import Testimonials from '../common/Testimonials';
import { guides } from '../data/guides';
import './GuideDetail.css';

const GuideDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Find guide by ID
  const guide = guides.find(g => g.id === parseInt(id)) || guides[0];

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      location: "London, UK",
      rating: 5,
      date: "January 2024",
      comment: "Our guide was absolutely amazing! His knowledge was incredible."
    },
    {
      id: 2,
      name: "Michael Chen",
      location: "Singapore",
      rating: 4,
      date: "December 2023",
      comment: "Very professional and punctual. Highly recommended!"
    }
  ];

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="guide-detail-page">
      <div className="container">
        {/* Back Button */}
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back to Guides
        </button>

        {/* Guide Profile */}
        <div className="guide-profile">
          <div className="profile-image">
            <div className="image-fallback">
              <span className="initials">{getInitials(guide.name)}</span>
            </div>
          </div>
          
          <div className="profile-info">
            <div className="profile-header">
              <div>
                <h1 className="guide-name">{guide.name}</h1>
                <div className="guide-location">
                  <span className="icon">📍</span>
                  {guide.location}, Sri Lanka
                </div>
              </div>
              {guide.verified && (
                <div className="verified-badge">
                  <span className="icon">✓</span>
                  Verified Guide
                </div>
              )}
            </div>
            
            <div className="profile-stats">
              <div className="stat">
                <div className="value">{guide.rating.toFixed(1)}</div>
                <div className="label">Rating</div>
              </div>
              <div className="stat">
                <div className="value">{guide.reviews}</div>
                <div className="label">Reviews</div>
              </div>
              <div className="stat">
                <div className="value">{guide.experience}</div>
                <div className="label">Experience</div>
              </div>
              <div className="stat">
                <div className="value">${guide.price}</div>
                <div className="label">per day</div>
              </div>
            </div>
            
            <div className="profile-tags">
              <div className="tag-group">
                <span className="label">Languages:</span>
                <div className="tags">
                  {guide.languages.map((lang, index) => (
                    <span key={index} className="tag">{lang}</span>
                  ))}
                </div>
              </div>
              
              <div className="tag-group">
                <span className="label">Specialties:</span>
                <div className="tags">
                  {guide.specialties.map((spec, index) => (
                    <span key={index} className="tag">{spec}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="guide-content">
          {/* Tabs */}
          <div className="guide-tabs">
            <button 
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({guide.reviews})
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'overview' && (
              <div className="overview-content">
                <div className="section">
                  <h2>About {guide.name}</h2>
                  <p className="description">{guide.description}</p>
                  
                  <div className="details-grid">
                    <div className="detail">
                      <span className="label">Response Time:</span>
                      <span className="value">{guide.responseTime}</span>
                    </div>
                    <div className="detail">
                      <span className="label">Availability:</span>
                      <span className="value available">Available Now</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div className="reviews-content">
                <Testimonials testimonials={testimonials} />
              </div>
            )}
          </div>
        </div>

        {/* Booking Sidebar */}
        <div className="booking-sidebar">
          <BookingForm guide={guide} price={guide.price} />
        </div>
      </div>
    </div>
  );
};

export default GuideDetail;