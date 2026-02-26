// src/pages/ToursPage.jsx - FIXED
import React, { useState, useEffect } from 'react';
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
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch real tours from backend
  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/tours');
        const data = await response.json();
        
        if (data.status === 'success') {
          setTours(data.data);
        }
      } catch (error) {
        console.error('Error fetching tours:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  // If still loading or no tours, show loading or fallback to hardcoded data
  const tourPackages = tours.length > 0 ? tours : [
    {
      _id: "699d48620ddb350b5e9ff8a2",
      name: "Cultural Triangle Explorer",
      duration: "3 Days",
      groupSize: "2-13 People",
      price: 240,
      features: ["Sigiriya Rock Fortress", "Ancient Temples", "UNESCO Sites"],
      description: "Visit ancient cities of Anuradhapura, Polonnaruwa, and climb the iconic Sigiriya Rock Fortress.",
      image: Cultural
    },
    {
      _id: "699d48620ddb350b5e9ff8a3",
      name: "Hill Country Adventure",
      duration: "4 Days",
      groupSize: "2-12 People",
      price: 320,
      features: ["Scenic Train Ride", "Tea Factory Visit", "Nine Arch Bridge"],
      description: "Experience the scenic train journey through tea plantations and visit Ella's breathtaking viewpoints.",
      image: Hill
    },
    {
      _id: "699d48620ddb350b5e9ff8a4",
      name: "Wildlife Safari Experience",
      duration: "3 Days",
      groupSize: "2-8 People",
      price: 240,
      features: ["Safari Jeep Tours", "Elephant Watching", "Bird Watching"],
      description: "Spot elephants, leopards, and exotic birds in Yala and Udawalawe National Parks.",
      image: Safari
    },
    {
      _id: "699d48620ddb350b5e9ff8a5",
      name: "Coastal Paradise Tour",
      duration: "4 Days",
      groupSize: "2-10 People",
      price: 320,
      features: ["Galle Fort", "Beach Relaxation", "Water Sports"],
      description: "Explore historic Galle Fort, pristine beaches, and enjoy water sports in the southern coast.",
      image: Coastal
    },
    {
      _id: "699d48620ddb350b5e9ff8a6",
      name: "Tea Country Journey",
      duration: "3 Days",
      groupSize: "2-15 People",
      price: 240,
      features: ["Tea Plantation Tour", "Tea Tasting", "Colonial Heritage"],
      description: "Immerse yourself in the lush tea estates of Nuwara Eliya and learn about Ceylon tea production.",
      image: Tea
    },
    {
      _id: "699d48620ddb350b5e9ff8a7",
      name: "Complete Sri Lanka Experience",
      duration: "12 Days",
      groupSize: "2-30 People",
      price: 960,
      features: ["All Major Attractions", "Full Island Tour", "Cultural Immersion"],
      description: "A comprehensive tour covering cultural sites, wildlife, hill country, and coastal attractions.",
      image: Full
    }
  ];

  const handleSelectTour = (tour) => {
    const days = parseInt(tour.duration.split(' ')[0]);
    const pricePerDay = Math.round(tour.price / days);
    
    const tourSelection = {
      id: tour._id,
      name: tour.name,
      duration: days,
      pricePerDay: pricePerDay,
      basePrice: tour.price,
      groupSize: tour.groupSize,
      features: tour.features
    };
    
    localStorage.setItem('selectedTour', JSON.stringify(tourSelection));
    navigate(`/tour-guides?tour=${tour._id}&name=${encodeURIComponent(tour.name)}&duration=${days}&pricePerDay=${pricePerDay}`);
  };

  const handleViewDetails = (tourId) => {
    navigate(`/tour-detail/${tourId}`);
  };

  if (loading) {
    return (
      <div className="loading-page">
        <div className="loading-spinner"></div>
        <p>Loading tours...</p>
      </div>
    );
  }

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
              const basePrice = tour.price;
              
              return (
                <div key={tour._id} className="tour-card">
                  <div className="tour-image">
                    <img src={tour.image} alt={tour.name} className="tour-img" />
                    <div className="tour-badge">Featured</div>
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
                        onClick={() => handleViewDetails(tour._id)}
                        className="btn-secondary"
                        style={{ 
                          flex: 1,
                          background: 'transparent',
                          border: '2px solid #1e4c24',
                          color: '#1e4c24'
                        }}
                      >
                        View Details
                      </button>
                      <button 
                        onClick={() => handleSelectTour(tour)}
                        className="btn-primary"
                        style={{ flex: 1 }}
                      >
                        Select Tour
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