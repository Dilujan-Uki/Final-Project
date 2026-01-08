// src/components/work/pages/DestinationsPage.jsx
import React, { useState } from 'react';
import SriLankaMap from '../common/SriLankaMap';
import { destinations } from '../data/destinations';
import './DestinationsPage.css';

const DestinationsPage = () => {
  const [selectedDestination, setSelectedDestination] = useState(null);

  return (
    <div className="destinations-page">
      {/* Hero Section */}
      <section className="destinations-hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Discover Sri Lanka</h1>
            <p className="hero-subtitle">Explore amazing destinations across the island</p>
          </div>
        </div>
      </section>

      {/* Interactive Map */}
      <section className="section map-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Explore the Island</h2>
            <p className="section-subtitle">Click on any location to find local guides</p>
          </div>
          <SriLankaMap />
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="section destinations-section bg-light">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Popular Destinations</h2>
            <p className="section-subtitle">Find your perfect Sri Lankan adventure</p>
          </div>

          <div className="destinations-grid">
            {destinations.map(destination => (
              <div 
                key={destination.id} 
                className={`destination-card ${selectedDestination?.id === destination.id ? 'selected' : ''}`}
                onClick={() => setSelectedDestination(destination)}
              >
                <div className="card-header">
                  <h3 className="destination-name">{destination.name}</h3>
                  <span className="guide-count">{destination.guides} guides</span>
                </div>
                <p className="destination-description">{destination.description}</p>
                <div className="destination-tags">
                  {destination.bestFor.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
                <div className="destination-info">
                  <div className="info">
                    <span className="label">Best Time:</span>
                    <span className="value">{destination.bestTime}</span>
                  </div>
                  <button 
                    className="explore-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `/guides?location=${destination.name}`;
                    }}
                  >
                    Find Guides
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Selected Destination Details */}
      {selectedDestination && (
        <section className="section selected-destination">
          <div className="container">
            <div className="destination-detail">
              <div className="detail-header">
                <h2 className="detail-title">{selectedDestination.name}</h2>
                <p className="detail-description">{selectedDestination.description}</p>
              </div>
              
              <div className="detail-content">
                <div className="attractions">
                  <h3>Top Attractions</h3>
                  <ul className="attractions-list">
                    {selectedDestination.attractions.map((attraction, index) => (
                      <li key={index} className="attraction">
                        <span className="icon">📍</span>
                        {attraction}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="destination-actions">
                  <button 
                    className="btn-primary"
                    onClick={() => window.location.href = `/guides?location=${selectedDestination.name}`}
                  >
                    Find Guides in {selectedDestination.name}
                  </button>
                  <button 
                    className="btn-secondary"
                    onClick={() => setSelectedDestination(null)}
                  >
                    Back to All Destinations
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Need Help Choosing?</h2>
            <p>Contact us for personalized recommendations based on your interests</p>
            <button 
              className="btn-primary"
              onClick={() => window.location.href = '/contact'}
            >
              Get Travel Advice
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DestinationsPage;