// src/pages/ToursPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ToursPage.css';
import Cultural from '/home/uki-dsa-01/LESSONS/Final-Project/Front-End/src/components/work/assets/Cultural-Triangle.png';
import Hill from '/home/uki-dsa-01/LESSONS/Final-Project/Front-End/src/components/work/assets/Hill-Country.png';
import Safari from '/home/uki-dsa-01/LESSONS/Final-Project/Front-End/src/components/work/assets/Wild-Safari.png';
import Coastal from '/home/uki-dsa-01/LESSONS/Final-Project/Front-End/src/components/work/assets/Coastal-Paradise.png';
import Tea from '/home/uki-dsa-01/LESSONS/Final-Project/Front-End/src/components/work/assets/Tea-Plantation.png';
import Full from '/home/uki-dsa-01/LESSONS/Final-Project/Front-End/src/components/work/assets/Complete-Experience.png'

const ToursPage = () => {
  const navigate = useNavigate();
  
  const tourPackages = [
    {
      id: 1,
      name: "Cultural Triangle Explorer",
      duration: "3 Days",
      groupSize: "2-13 People",
      pricePerDay: 80,
      features: ["Sigiriya Rock Fortress", "Ancient Temples", "UNESCO Sites"],
      description: "Visit ancient cities of Anuradhapura, Polonnaruwa, and climb the iconic Sigiriya...",
      image: Cultural
    },
    {
      id: 2,
      name: "Hill Country Adventure",
      duration: "4 Days",
      groupSize: "2-12 People",
      pricePerDay: 80,
      features: ["Scenic Train Ride", "Tea Factory Visit", "Nine Arch Bridge"],
      description: "Experience the scenic train journey through tea plantations and visit Ella's breathtaking...",
      image: Hill
    },
    {
      id: 3,
      name: "Wildlife Safari Experience",
      duration: "3 Days",
      groupSize: "2-8 People",
      pricePerDay: 80,
      features: ["Safari Jeep Tours", "Elephant Watching", "Bird Watching"],
      description: "Spot elephants, leopards, and exotic birds in Yala and Udawalawe National Parks",
      image: Safari
    },
    {
      id: 4,
      name: "Coastal Paradise Tour",
      duration: "4 Days",
      groupSize: "2-10 People",
      pricePerDay: 80,
      features: ["Galle Fort", "Beach Relaxation", "Water Sports"],
      description: "Explore historic Galle Fort, pristine beaches, and enjoy water sports in the southern coast.",
      image: Coastal
    },
    {
      id: 5,
      name: "Tea Country Journey",
      duration: "3 Days",
      groupSize: "2-15 People",
      pricePerDay: 80,
      features: ["Tea Plantation Tour", "Tea Tasting", "Colonial Heritage"],
      description: "Immerse yourself in the lush tea estates of Nuwara Eliya and learn about Ceylon tea...",
      image: Tea
    },
    {
      id: 6,
      name: "Complete Sri Lanka Experience",
      duration: "12 Days",
      groupSize: "2-30 People",
      pricePerDay: 80,
      features: ["All Major Attractions", "Full Island Tour", "Cultural Immersion"],
      description: "A comprehensive tour covering cultural sites, wildlife, hill country, and coastal attractions.",
      image:Full
    }
  ];

  const handleSelectTour = (tour) => {
    const days = parseInt(tour.duration.split(' ')[0]);
    const basePrice = days * tour.pricePerDay;
    
    // Store tour selection in localStorage or pass via URL
    const tourSelection = {
      id: tour.id,
      name: tour.name,
      duration: days,
      pricePerDay: tour.pricePerDay,
      basePrice: basePrice,
      groupSize: tour.groupSize,
      features: tour.features
    };
    
    localStorage.setItem('selectedTour', JSON.stringify(tourSelection));
    
    // Navigate to tour guides page
    navigate(`/tour-guides?tour=${tour.id}&name=${encodeURIComponent(tour.name)}&duration=${days}&pricePerDay=${tour.pricePerDay}`);
  };

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
            {tourPackages.map((tour) => {
              const days = parseInt(tour.duration.split(' ')[0]);
              const basePrice = days * tour.pricePerDay;
              
              return (
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
                      <div className="detail">
                        <span className="detail-label">From:</span>
                        <span className="detail-value">${basePrice}/person</span>
                      </div>
                    </div>
                    
                    <div className="tour-features">
                      {tour.features.map((feature, index) => (
                        <span key={index} className="feature-tag">{feature}</span>
                      ))}
                    </div>
                    
                    <div className="tour-actions">
                      <button 
                        onClick={() => handleSelectTour(tour)}
                        className="btn-primary"
                      >
                        Select This Tour
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ToursPage;