// src/pages/ToursPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ToursPage.css';
import { getTourImage } from '/home/uki-dsa-01/LESSONS/Final-Project/Front-End/src/utils/tourImageMapping';

const ToursPage = () => {
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/tours');
        const data = await response.json();
        
        if (data.status === 'success') {
          const toursWithImages = data.data.map(tour => ({
            ...tour,
            localImage: getTourImage(tour)
          }));
          setTours(toursWithImages);
        }
      } catch (error) {
        console.error('Error fetching tours:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

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

      <section className="tours-section">
        <div className="container">
          <div className="tours-grid">
            {tours.map((tour) => {
              const basePrice = tour.price; // Removed unused 'days' variable
              
              return (
                <div key={tour._id} className="tour-card">
                  <div className="tour-image">
                    <img 
                      src={tour.localImage} 
                      alt={tour.name} 
                      className="tour-img" 
                    />
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