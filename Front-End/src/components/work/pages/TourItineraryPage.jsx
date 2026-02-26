// src/pages/TourItineraryPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TourItineraryPage.css';

const TourItineraryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch tour details
    const fetchTour = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/tours/${id}`);
        const data = await response.json();
        
        if (data.status === 'success') {
          setTour(data.data);
        }
      } catch (error) {
        console.error('Error fetching tour:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [id]);

  // Sample itinerary data - In real app, this would come from backend
  const itinerary = {
    day1: {
      title: "Arrival & Welcome",
      activities: [
        "Arrival at Bandaranaike International Airport",
        "Meet your guide and transfer to hotel",
        "Welcome dinner with Sri Lankan cuisine",
        "Briefing about the tour"
      ],
      meals: ["Dinner"],
      accommodation: "Colombo - 5* Hotel"
    },
    day2: {
      title: "Cultural Exploration",
      activities: [
        "Visit Gangaramaya Temple",
        "Explore Colombo National Museum",
        "Lunch at local restaurant",
        "Evening walk at Galle Face Green",
        "Shopping at Pettah Market"
      ],
      meals: ["Breakfast", "Lunch"],
      accommodation: "Colombo - 5* Hotel"
    },
    day3: {
      title: "Journey to Kandy",
      activities: [
        "Drive to Kandy (3 hours)",
        "Visit Pinnawala Elephant Orphanage",
        "Lunch en route",
        "Temple of the Tooth Relic visit",
        "Traditional cultural dance performance"
      ],
      meals: ["Breakfast", "Dinner"],
      accommodation: "Kandy - Heritage Hotel"
    }
  };

  if (loading) {
    return (
      <div className="loading-page">
        <div className="loading-spinner"></div>
        <p>Loading itinerary...</p>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="not-found">
        <h2>Tour not found</h2>
        <button onClick={() => navigate('/tours')} className="btn-primary">
          Browse Tours
        </button>
      </div>
    );
  }

  return (
    <div className="itinerary-page">
      {/* Hero Section */}
      <section className="itinerary-hero">
        <div className="container">
          <h1 className="hero-title">{tour.name}</h1>
          <p className="hero-subtitle">{tour.duration} • {tour.groupSize}</p>
        </div>
      </section>

      <div className="container">
        <div className="itinerary-content">
          {/* Tour Overview */}
          <div className="tour-overview">
            <h2 className="section-title">Tour Overview</h2>
            <p className="tour-description">{tour.description}</p>
            
            <div className="tour-highlights">
              <h3>Highlights</h3>
              <div className="highlights-grid">
                {tour.features?.map((feature, index) => (
                  <div key={index} className="highlight-item">
                    <span className="highlight-icon">✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Daily Itinerary */}
          <div className="daily-itinerary">
            <h2 className="section-title">Daily Itinerary</h2>
            
            {Object.entries(itinerary).map(([day, details]) => (
              <div key={day} className="day-card">
                <div className="day-header">
                  <span className="day-number">{day.replace('day', 'Day ')}</span>
                  <h3 className="day-title">{details.title}</h3>
                </div>
                
                <div className="day-content">
                  <div className="activities">
                    <h4>Activities:</h4>
                    <ul>
                      {details.activities.map((activity, index) => (
                        <li key={index}>{activity}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="day-details">
                    <div className="detail-item">
                      <span className="detail-label">Meals:</span>
                      <span className="detail-value">{details.meals.join(', ')}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Accommodation:</span>
                      <span className="detail-value">{details.accommodation}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Inclusions & Exclusions */}
          <div className="inclusions-section">
            <div className="inclusions-grid">
              <div className="inclusions-card">
                <h3 className="card-title green">✓ What's Included</h3>
                <ul>
                  <li>Accommodation as per itinerary</li>
                  <li>All meals as specified</li>
                  <li>Private air-conditioned vehicle</li>
                  <li>English-speaking guide</li>
                  <li>All entrance fees</li>
                  <li>Bottled water during tours</li>
                </ul>
              </div>
              
              <div className="inclusions-card">
                <h3 className="card-title orange">✗ What's Not Included</h3>
                <ul>
                  <li>International flights</li>
                  <li>Visa fees</li>
                  <li>Personal expenses</li>
                  <li>Travel insurance</li>
                  <li>Tips and gratuities</li>
                  <li>Alcoholic beverages</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Book Now Button */}
          <div className="booking-cta">
            <div className="price-box">
              <span className="price-label">Starting from</span>
              <span className="price-value">${tour.price}</span>
              <span className="price-period">per person</span>
            </div>
            
            <button 
              className="btn-primary book-now-btn"
              onClick={() => {
                const days = parseInt(tour.duration.split(' ')[0]);
                navigate(`/tour-guides?tour=${tour._id}&name=${encodeURIComponent(tour.name)}&duration=${days}&pricePerDay=${tour.price / days}`);
              }}
            >
              Book This Tour
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourItineraryPage;