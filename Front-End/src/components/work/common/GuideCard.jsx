// src/components/work/common/GuideCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './GuideCard.css';

const GuideCard = ({ guide }) => {
  // Fallback if image is not available
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="guide-card">
      <div className="guide-image-container">
        {guide.image ? (
          <img 
            src={guide.image} 
            alt={guide.name}
            className="guide-image"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className="guide-image-fallback" style={{ display: guide.image ? 'none' : 'flex' }}>
          <span className="guide-initials">{getInitials(guide.name)}</span>
        </div>
        
        {guide.verified && (
          <div className="verified-badge">
            <span className="verified-icon">✓</span>
            Verified Guide
          </div>
        )}
      </div>
      
      <div className="guide-info">
        <div className="guide-header">
          <h3 className="guide-name">{guide.name}</h3>
          <span className="guide-price">${guide.price}/day</span>
        </div>
        
        <div className="guide-location">
          <span className="location-icon">📍</span>
          {guide.location}
        </div>
        
        <div className="guide-languages">
          <span className="label">Languages:</span>
          <div className="language-tags">
            {guide.languages.slice(0, 3).map((lang, index) => (
              <span key={index} className="language-tag">{lang}</span>
            ))}
            {guide.languages.length > 3 && (
              <span className="language-tag">+{guide.languages.length - 3}</span>
            )}
          </div>
        </div>
        
        <div className="guide-rating">
          <div className="stars">
            {'★'.repeat(Math.floor(guide.rating))}
            {'☆'.repeat(5 - Math.floor(guide.rating))}
          </div>
          <span className="rating-score">{guide.rating.toFixed(1)}</span>
          <span className="rating-count">({guide.reviews} reviews)</span>
        </div>
        
        <div className="guide-specialties">
          {guide.specialties.slice(0, 3).map((spec, index) => (
            <span key={index} className="specialty-tag">{spec}</span>
          ))}
        </div>
        
        <div className="guide-actions">
          <Link to={`/guide/${guide.id}`} className="btn-view">
            View Profile
          </Link>
          <Link to={`/booking/${guide.id}`} className="btn-book">
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GuideCard;