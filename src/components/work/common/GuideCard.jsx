// src/components/work/GuideCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './styles/GuideCard.css';

const GuideCard = ({ guide }) => {
  return (
    <div className="neumorphism-card fade-in-up">
      <div className="guide-card-inner">
        {/* Guide Image */}
        <div className="guide-image-container">
          <img 
            src={guide.image} 
            alt={guide.name}
            className="guide-image"
          />
          {guide.verified && (
            <div className="verified-badge">
              <span className="verified-icon">✓</span>
              Verified Guide
            </div>
          )}
        </div>
        
        {/* Guide Info */}
        <div className="guide-info">
          <div className="flex justify-between items-start mb-2">
            <h3 className="guide-name">{guide.name}</h3>
            <span className="price-tag">${guide.price}/day</span>
          </div>
          
          <div className="flex items-center mb-3">
            <span className="location-icon">📍</span>
            <span className="guide-location">{guide.location}</span>
          </div>
          
          {/* Languages */}
          <div className="languages mb-3">
            <span className="language-label">Languages:</span>
            <div className="language-tags">
              {guide.languages.map((lang, index) => (
                <span key={index} className="language-tag">{lang}</span>
              ))}
            </div>
          </div>
          
          {/* Rating */}
          <div className="guide-rating mb-4">
            <div className="rating-stars">
              {'★'.repeat(Math.floor(guide.rating))}
              {'☆'.repeat(5 - Math.floor(guide.rating))}
            </div>
            <span className="rating-score">{guide.rating}/5</span>
            <span className="rating-count">({guide.reviews} reviews)</span>
          </div>
          
          {/* Specialties */}
          <div className="specialties mb-4">
            {guide.specialties.map((spec, index) => (
              <span key={index} className="specialty-tag">{spec}</span>
            ))}
          </div>
          
          {/* Action Buttons */}
          <div className="guide-actions">
            <Link 
              to={`/guide/${guide.id}`}
              className="view-profile-btn"
            >
              View Profile
            </Link>
            <button className="book-now-btn">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideCard;