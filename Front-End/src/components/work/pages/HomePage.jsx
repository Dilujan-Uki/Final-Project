// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const popularDestinations = [
    {
      name: "Sigiriya Rock Fortress",
      image: "https://images.unsplash.com/photo-1593693399749-55d0b5d58b14?w=400&h=300&fit=crop",
      description: "Ancient rock fortress and palace ruins"
    },
    {
      name: "Ella Train Journey",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      description: "Scenic train ride through tea plantations"
    },
    {
      name: "Tea Plantations",
      image: "https://images.unsplash.com/photo-1566836742817-68d55b53521d?w-400&h=300&fit=crop",
      description: "Visit lush tea estates in hill country"
    }
  ];

  const whyChooseUs = [
    {
      title: "Best Locations",
      description: "Explore UNESCO World Heritage Sites and hidden gems across Sri Lanka"
    },
    {
      title: "Expert Guides",
      description: "Professional, licensed tour guides with extensive local knowledge"
    },
    {
      title: "Personalized Tours",
      description: "Customized itineraries tailored to your interests and schedule"
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section - From home1.png */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Discover Sri Lanka</h1>
            <p className="hero-subtitle">
              The Pearl of the Indian Ocean Awaits Your Exploration
            </p>
            <div className="hero-buttons">
              <Link to="/tours" className="btn-primary">Explore Tours</Link>
              <Link to="/contact" className="btn-secondary">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section - From home2.png */}
      <section className="why-choose-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose Ceylon Tours?</h2>
          </div>
          <div className="features-grid">
            {whyChooseUs.map((feature, index) => (
              <div key={index} className="feature-card">
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations Section - From home3.png */}
      <section className="destinations-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Popular Destinations</h2>
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
            <h2 className="cta-title">Ready for Your Adventure?</h2>
            <p className="cta-description">
              Book your tour today and experience the best of Sri Lanka
            </p>
            <Link to="/tours" className="btn-primary">View All Tours</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
