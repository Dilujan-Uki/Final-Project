// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import Sigiriya from '/home/uki-dsa-01/LESSONS/Final-Project/Front-End/src/components/work/assets/Sigiriya-Rock.png';
import Train from '/home/uki-dsa-01/LESSONS/Final-Project/Front-End/src/components/work/assets/Ella-Train.png';
import Tea from '/home/uki-dsa-01/LESSONS/Final-Project/Front-End/src/components/work/assets/Tea-Plantation.png';
import SriLanka from '/home/uki-dsa-01/LESSONS/Final-Project/Front-End/src/components/work/assets/SriLanka.png';

const HomePage = () => {
  const popularDestinations = [
    {
      name: "Sigiriya Rock Fortress",
      image: Sigiriya,
      description: "Ancient rock fortress and palace ruins, the 8th wonder of the world"
    },
    {
      name: "Ella Train Journey",
      image: Train,
      description: "Scenic train ride through misty tea plantations and breathtaking valleys"
    },
    {
      name: "Tea Plantations",
      image: Tea,
      description: "Visit lush tea estates in hill country and taste world-famous Ceylon tea"
    }
  ];

  const whyChooseUs = [
    {
      icon: "🏆",
      title: "Authentic Experiences",
      description: "Handcrafted tours that showcase the real Sri Lanka, beyond tourist traps"
    },
    {
      icon: "👑",
      title: "Expert Local Guides",
      description: "Licensed, professional guides with deep knowledge and genuine passion"
    },
    {
      icon: "🎯",
      title: "Personalized Itineraries",
      description: "Custom-designed journeys that match your interests and pace"
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section with Sri Lanka Image */}
      <section className="hero-section">
        <div className="hero-background">
          <img src={SriLanka} alt="Sri Lanka Paradise" className="hero-image" />
          <div className="hero-overlay"></div>
        </div>
        
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Discover <span>Sri Lanka</span>
            </h1>
            <p className="hero-subtitle">
              The Pearl of the Indian Ocean Awaits Your Exploration
            </p>
            <div className="hero-buttons">
              <Link to="/tours" className="btn-primary">Explore Tours</Link>
              <Link to="/contact" className="btn-secondary">Contact Us</Link>
            </div>
          </div>
        </div>
        
        <div className="scroll-indicator">
          <span></span>
          Scroll
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose Ceylon Tours?</h2>
            <p className="section-subtitle">
              Experience Sri Lanka through the eyes of locals, with authentic tours crafted with love and expertise
            </p>
          </div>
          <div className="features-grid">
            {whyChooseUs.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations Section */}
      <section className="destinations-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Popular Destinations</h2>
            <p className="section-subtitle">
              Explore Sri Lanka's most beloved destinations, each with its own unique charm and story
            </p>
          </div>
          <div className="destinations-grid">
            {popularDestinations.map((destination, index) => (
              <div key={index} className="destination-card">
                <div className="destination-image">
                  <img 
                    src={destination.image} 
                    alt={destination.name}
                    className="destination-img"
                  />
                </div>
                <div className="destination-content">
                  <h3 className="destination-name">{destination.name}</h3>
                  <p className="destination-description">{destination.description}</p>
                  <div className="destination-stats">
                    <div className="stat-item">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      <span>Best in {['2023', '2024', '2024'][index]}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready for Your Sri Lankan Adventure?</h2>
            <p className="cta-description">
              Book your tour today and create memories that will last a lifetime
            </p>
            <Link to="/tours" className="btn-primary">View All Tours</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
