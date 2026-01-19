// src/pages/ToursPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './ToursPage.css';

const ToursPage = () => {
  const tourPackages = [
    {
      id: 1,
      name: "Cultural Triangle Explorer",
      duration: "3 Days",
      groupSize: "2-13 People",
      features: ["Sigiriya Rock Fortress", "Ancient Temples", "UNESCO Sites"],
      description: "Visit ancient cities of Anuradhapura, Polonnaruwa, and climb the iconic Sigiriya...",
      image: "https://images.unsplash.com/photo-1593693399749-55d0b5d58b14?w=600&h=400&fit=crop"
    },
    {
      id: 2,
      name: "Hill Country Adventure",
      duration: "4 Days",
      groupSize: "2-12 People",
      features: ["Scenic Train Ride", "Tea Factory Visit", "Nine Arch Bridge"],
      description: "Experience the scenic train journey through tea plantations and visit Ella's breathtaking...",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop"
    },
    {
      id: 3,
      name: "Wildlife Safari Experience",
      duration: "3 Days",
      groupSize: "2-8 People",
      features: ["Safari Jeep Tours", "Elephant Watching", "Bird Watching"],
      description: "Spot elephants, leopards, and exotic birds in Yala and Udawalawe National Parks",
      image: "https://images.unsplash.com/photo-1528164344705-47542687000d?w=600&h=400&fit=crop"
    },
    {
      id: 4,
      name: "Coastal Paradise Tour",
      duration: "4 Days",
      groupSize: "2-10 People",
      features: ["Galle Fort", "Beach Relaxation", "Water Sports"],
      description: "Explore historic Galle Fort, pristine beaches, and enjoy water sports in the southern coast.",
      image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&h=400&fit=crop"
    },
    {
      id: 5,
      name: "Tea Country Journey",
      duration: "3 Days",
      groupSize: "2-15 People",
      features: ["Tea Plantation Tour", "Tea Tasting", "Colonial Heritage"],
      description: "Immerse yourself in the lush tea estates of Nuwara Eliya and learn about Ceylon tea...",
      image: "https://images.unsplash.com/photo-1566836742817-68d55b53521d?w=600&h=400&fit=crop"
    },
    {
      id: 6,
      name: "Complete Sri Lanka Experience",
      duration: "12 Days",
      groupSize: "2-30 People",
      features: ["All Major Attractions", "Full Island Tour", "Cultural Immersion"],
      description: "A comprehensive tour covering cultural sites, wildlife, hill country, and coastal attractions.",
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop"
    }
  ];

  return (
    <div className="tours-page">
      {/* Hero Section */}
      <section className="tours-hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Our Tour Packages</h1>
            <p className="hero-subtitle">
              Carefully curated experiences to showcase the best of Sri Lanka
            </p>
          </div>
        </div>
      </section>

      {/* Tours Grid */}
      <section className="tours-section">
        <div className="container">
          <div className="tours-grid">
            {tourPackages.map((tour) => (
              <div key={tour.id} className="tour-card">
                <div className="tour-image">
                  <img src={tour.image} alt={tour.name} className="tour-img" />
                </div>
                <div className="tour-content">
                  <h3 className="tour-name">{tour.name}</h3>
                  <p className="tour-description">{tour.description}</p>
                  
                  <div className="tour-details">
                    <div className="detail">
                      <span className="detail-label">Duration:</span>
                      <span className="detail-value">{tour.duration}</span>
                    </div>
                    <div className="detail">
                      <span className="detail-label">Group Size:</span>
                      <span className="detail-value">{tour.groupSize}</span>
                    </div>
                  </div>
                  
                  <div className="tour-features">
                    {tour.features.map((feature, index) => (
                      <span key={index} className="feature-tag">{feature}</span>
                    ))}
                  </div>
                  
                  <div className="tour-actions">
                    <Link to={`/payment?tour=${tour.id}`} className="btn-primary">
                      Book Now
                    </Link>
                    <Link to={`/tour-details/${tour.id}`} className="btn-secondary">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ToursPage;
