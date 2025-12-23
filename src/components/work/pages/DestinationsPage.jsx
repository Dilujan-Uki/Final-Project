// src/components/work/pages/DestinationsPage.jsx
import React, { useState } from 'react';
import SriLankaMap from '../common/SriLankaMap';
import PricingCard from '../common/PricingCard';
import { destinations } from '../assets/data/destinations';
import './DestinationsPage.css';

const DestinationsPage = () => {
  const [selectedDestination, setSelectedDestination] = useState(destinations[0]);
  const [filter, setFilter] = useState('all');

  const destinationTypes = [
    { id: 'all', name: 'All Destinations', icon: '🌍' },
    { id: 'cultural', name: 'Cultural', icon: '🏛️' },
    { id: 'beach', name: 'Beach', icon: '🏖️' },
    { id: 'nature', name: 'Nature', icon: '🌳' },
    { id: 'historical', name: 'Historical', icon: '🏺' },
    { id: 'city', name: 'City', icon: '🏙️' }
  ];

  const pricingPlans = [
    {
      id: 1,
      name: "Half Day",
      price: 45,
      period: "day",
      description: "Perfect for a quick introduction",
      features: [
        { text: "4-5 hours guiding", included: true },
        { text: "Local market visit", included: true },
        { text: "Food tasting included", included: true },
        { text: "Transportation", included: false },
        { text: "Entrance fees", included: false },
        { text: "24/7 support", included: true }
      ],
      valueNote: "Best for short visits"
    },
    {
      id: 2,
      name: "Full Day",
      price: 85,
      period: "day",
      description: "Most popular choice",
      features: [
        { text: "8-10 hours guiding", included: true },
        { text: "Multiple destinations", included: true },
        { text: "Lunch included", included: true },
        { text: "Transportation arranged", included: true },
        { text: "Photo assistance", included: true },
        { text: "24/7 support", included: true }
      ],
      valueNote: "Most booked package"
    },
    {
      id: 3,
      name: "Multi-Day",
      price: 150,
      period: "day",
      description: "Complete Sri Lankan experience",
      features: [
        { text: "Custom itinerary", included: true },
        { text: "Hotel arrangements", included: true },
        { text: "All meals included", included: true },
        { text: "Private transportation", included: true },
        { text: "24/7 guide support", included: true },
        { text: "Priority booking", included: true }
      ],
      valueNote: "Save 15% on multi-day"
    }
  ];

  return (
    <div className="destinations-page">
      {/* Hero Section */}
      <section className="destinations-hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Discover Sri Lanka</h1>
            <p className="hero-subtitle">Explore diverse landscapes, rich culture, and unforgettable experiences</p>
          </div>
        </div>
      </section>

      {/* Interactive Map */}
      <section className="map-section section-padding">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Explore Our Island Paradise</h2>
            <p className="section-subtitle">Click on any location to discover local guides and attractions</p>
          </div>
          
          <SriLankaMap />
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="destinations-section section-padding bg-light">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Popular Destinations</h2>
            <p className="section-subtitle">Find your perfect Sri Lankan adventure</p>
          </div>
          
          {/* Filters */}
          <div className="destination-filters">
            {destinationTypes.map(type => (
              <button
                key={type.id}
                className={`filter-btn ${filter === type.id ? 'active' : ''}`}
                onClick={() => setFilter(type.id)}
              >
                <span className="filter-icon">{type.icon}</span>
                {type.name}
              </button>
            ))}
          </div>
          
          {/* Destinations Grid */}
          <div className="destinations-grid">
            {destinations.map(destination => (
              <div key={destination.id} className="destination-card">
                <div className="destination-image">
                  <img 
                    src={require(`../assets/images/backgrounds/${destination.image}`)} 
                    alt={destination.name}
                  />
                  <div className="image-overlay">
                    <div className="guides-count">
                      <span className="guide-icon">👨‍🏫</span>
                      {destination.guides} Guides
                    </div>
                  </div>
                </div>
                
                <div className="destination-content">
                  <h3 className="destination-name">{destination.name}</h3>
                  <p className="destination-description">{destination.description}</p>
                  
                  <div className="destination-tags">
                    {destination.bestFor.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                  
                  <div className="destination-details">
                    <div className="detail">
                      <span className="detail-label">Best Time:</span>
                      <span className="detail-value">{destination.bestTime}</span>
                    </div>
                    <div className="detail">
                      <span className="detail-label">Guides:</span>
                      <span className="detail-value">{destination.guides} available</span>
                    </div>
                  </div>
                  
                  <button 
                    className="explore-btn"
                    onClick={() => setSelectedDestination(destination)}
                  >
                    Explore {destination.name}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Selected Destination Details */}
      {selectedDestination && (
        <section className="selected-destination section-padding">
          <div className="container">
            <div className="destination-detail">
              <div className="detail-header">
                <h2 className="detail-title">{selectedDestination.name}</h2>
                <p className="detail-subtitle">{selectedDestination.description}</p>
              </div>
              
              <div className="detail-content">
                <div className="attractions">
                  <h3>Top Attractions</h3>
                  <ul className="attractions-list">
                    {selectedDestination.attractions.map((attraction, index) => (
                      <li key={index} className="attraction-item">
                        <span className="attraction-icon">📍</span>
                        {attraction}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="destination-info">
                  <div className="info-card">
                    <h4>Best For</h4>
                    <div className="info-tags">
                      {selectedDestination.bestFor.map((item, index) => (
                        <span key={index} className="info-tag">{item}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="info-card">
                    <h4>Local Guides</h4>
                    <p className="guide-count">{selectedDestination.guides} verified guides available</p>
                    <button 
                      className="find-guides-btn"
                      onClick={() => window.location.href = `/guides?location=${selectedDestination.name}`}
                    >
                      Find Guides in {selectedDestination.name}
                    </button>
                  </div>
                  
                  <div className="info-card">
                    <h4>Best Time to Visit</h4>
                    <p className="best-time">{selectedDestination.bestTime}</p>
                    <div className="weather-info">
                      <span className="weather-icon">☀️</span>
                      <span>Avg. 28°C | Sunny most days</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Pricing Section */}
      <section className="pricing-section section-padding">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Transparent Pricing</h2>
            <p className="section-subtitle">No hidden fees. Everything included in one price</p>
          </div>
          
          <div className="pricing-grid">
            {pricingPlans.map((plan, index) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                featured={index === 1}
              />
            ))}
          </div>
          
          <div className="pricing-note">
            <p>All prices are per day. Multi-day discounts available. Contact for group rates.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="destinations-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Explore Sri Lanka?</h2>
            <p>Connect with local experts for an authentic experience</p>
            <div className="cta-buttons">
              <button 
                className="btn-primary"
                onClick={() => window.location.href = '/guides'}
              >
                Find Your Guide
              </button>
              <button 
                className="btn-secondary"
                onClick={() => window.location.href = '/contact'}
              >
                Get Travel Advice
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DestinationsPage;