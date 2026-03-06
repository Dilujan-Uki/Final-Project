// src/pages/TourDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TourDetailPage.css';
import { getTourImage } from '../../../utils/tourImageMapping';

const TourDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [tour, setTour] = useState(null);
  const [tourDetails, setTourDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeDay, setActiveDay] = useState(1);
  const [activeTab, setActiveTab] = useState('overview');
  const [localImage, setLocalImage] = useState(null);

  useEffect(() => {
    const fetchTourData = async () => {
      try {
        setLoading(true);
        setError('');
        
        const tourResponse = await fetch(`http://localhost:5000/api/tours/${id}`);
        
        if (!tourResponse.ok) {
          throw new Error('Failed to fetch tour');
        }
        
        const tourData = await tourResponse.json();
        
        if (tourData.status === 'success') {
          setTour(tourData.data);
          setLocalImage(getTourImage(tourData.data));
        } else {
          throw new Error('Invalid tour data format');
        }

        try {
          const detailsResponse = await fetch(`http://localhost:5000/api/tour-details/${id}`);
          
          if (detailsResponse.ok) {
            const detailsData = await detailsResponse.json();
            
            if (detailsData.status === 'success' && detailsData.data) {
              setTourDetails(detailsData.data);
            } else {
              setTourDetails({
                overview: tourData.data.description,
                highlights: tourData.data.features || [],
                itinerary: [],
                inclusions: [],
                exclusions: [],
                practicalInfo: {},
                faqs: []
              });
            }
          } else {
            setTourDetails({
              overview: tourData.data.description,
              highlights: tourData.data.features || [],
              itinerary: [],
              inclusions: [],
              exclusions: [],
              practicalInfo: {},
              faqs: []
            });
          }
        } catch (detailsErr) {
          setTourDetails({
            overview: tourData.data.description,
            highlights: tourData.data.features || [],
            itinerary: [],
            inclusions: [],
            exclusions: [],
            practicalInfo: {},
            faqs: []
          });
        }
        
      } catch (err) {
        console.error('Error fetching tour:', err);
        setError('Failed to load tour details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTourData();
    }
  }, [id]);

  const handleBookNow = () => {
    if (!tour) return;
    
    const days = parseInt(tour.duration) || 3;
    const pricePerDay = Math.round(tour.price / days);
    
    navigate(`/tour-guides?tour=${tour._id}&name=${encodeURIComponent(tour.name)}&duration=${days}&pricePerDay=${pricePerDay}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="loading-page">
        <div className="container">
          <div className="loading-spinner"></div>
          <p>Loading tour details...</p>
        </div>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="error-page">
        <div className="container">
          <h2>Tour Not Found</h2>
          <p>{error || 'The tour you\'re looking for doesn\'t exist.'}</p>
          <button onClick={() => navigate('/tours')} className="btn-primary">
            Browse Tours
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tour-detail-page">
      {/* Hero Section */}
      <section 
        className="detail-hero"
        style={{
          backgroundImage: `url(${localImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title1">{tour.name}</h1>
            <div className="hero-meta">
              <span className="meta-item">
                <span role="img" aria-label="duration">⏱️</span> {tour.duration}
              </span>
              <span className="meta-item">
                <span role="img" aria-label="group">👥</span> {tour.groupSize}
              </span>
              <span className="meta-item">
                <span role="img" aria-label="rating">⭐</span> {tourDetails?.reviewsSummary?.averageRating || '4.8'} ({tourDetails?.reviewsSummary?.totalReviews || 120} reviews)
              </span>
            </div>
            <div className="hero-price">
              <span className="price-label">Starting from</span>
              <span className="price-value">{formatPrice(tour.price)}</span>
              <span className="price-period">per person</span>
            </div>
            <button onClick={handleBookNow} className="hero-btn">
              Book This Tour
            </button>
          </div>
        </div>
      </section>

      <div className="tour-detail-body">
        {/* Navigation Tabs */}
        <div className="detail-tabs">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-btn ${activeTab === 'itinerary' ? 'active' : ''}`}
            onClick={() => setActiveTab('itinerary')}
          >
            Itinerary
          </button>
          <button 
            className={`tab-btn ${activeTab === 'inclusions' ? 'active' : ''}`}
            onClick={() => setActiveTab('inclusions')}
          >
            Inclusions
          </button>
          <button 
            className={`tab-btn ${activeTab === 'practical' ? 'active' : ''}`}
            onClick={() => setActiveTab('practical')}
          >
            Practical Info
          </button>
          <button 
            className={`tab-btn ${activeTab === 'faq' ? 'active' : ''}`}
            onClick={() => setActiveTab('faq')}
          >
            FAQ
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <h2 className="section-title">Tour Overview</h2>
              <p className="overview-text">{tourDetails?.overview || tour.description}</p>
              
              <div className="highlights-grid">
                <h3>Highlights</h3>
                <div className="highlights-list">
                  {(tourDetails?.highlights && tourDetails.highlights.length > 0 
                    ? tourDetails.highlights 
                    : tour.features || []
                  ).map((highlight, index) => (
                    <div key={index} className="highlight-item">
                      <span className="highlight-icon">✓</span>
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="quick-info">
                <div className="info-card">
                  <span className="info-icon">⏱️</span>
                  <div>
                    <h4>Duration</h4>
                    <p>{tour.duration}</p>
                  </div>
                </div>
                <div className="info-card">
                  <span className="info-icon">👥</span>
                  <div>
                    <h4>Group Size</h4>
                    <p>{tour.groupSize}</p>
                  </div>
                </div>
                <div className="info-card">
                  <span className="info-icon">📍</span>
                  <div>
                    <h4>Start Point</h4>
                    <p>Colombo</p>
                  </div>
                </div>
                <div className="info-card">
                  <span className="info-icon">🌤️</span>
                  <div>
                    <h4>Best Season</h4>
                    <p>{tourDetails?.practicalInfo?.bestTimeToVisit || 'Year Round'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Itinerary Tab */}
          {activeTab === 'itinerary' && (
            <div className="itinerary-tab">
              <h2 className="section-title">Detailed Itinerary</h2>
              
              {tourDetails?.itinerary && tourDetails.itinerary.length > 0 ? (
                <div className="itinerary-container">
                  {/* Day Navigation */}
                  <div className="day-navigation">
                    {tourDetails.itinerary.map((day) => (
                      <button
                        key={day.day}
                        className={`day-btn ${activeDay === day.day ? 'active' : ''}`}
                        onClick={() => setActiveDay(day.day)}
                      >
                        Day {day.day}
                      </button>
                    ))}
                  </div>

                  {/* Current Day Details */}
                  {tourDetails.itinerary
                    .filter(day => day.day === activeDay)
                    .map(day => (
                      <div key={day.day} className="day-details">
                        <h3 className="day-title">{day.title}</h3>
                        <p className="day-description">{day.description}</p>
                        
                        <div className="activities-list">
                          <h4>Activities:</h4>
                          <ul>
                            {day.activities && day.activities.map((activity, idx) => (
                              <li key={idx}>{activity}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="day-info">
                          {day.meals && day.meals.length > 0 && (
                            <div className="info-item">
                              <span className="label">Meals:</span>
                              <span className="value">{day.meals.join(', ')}</span>
                            </div>
                          )}
                          {day.accommodation && (
                            <div className="info-item">
                              <span className="label">Accommodation:</span>
                              <span className="value">{day.accommodation}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="coming-soon">
                  <p>Detailed itinerary coming soon. Please check back later.</p>
                </div>
              )}
            </div>
          )}

          {/* Inclusions Tab */}
          {activeTab === 'inclusions' && (
            <div className="inclusions-tab">
              <div className="inclusions-grid">
                <div className="inclusions-card">
                  <h3 className="card-title green">✓ What's Included</h3>
                  <ul className="inclusions-list">
                    {tourDetails?.inclusions && tourDetails.inclusions.length > 0 ? (
                      tourDetails.inclusions.map((category, idx) => (
                        <div key={idx}>
                          <li className="category-header">{category.category}</li>
                          {category.items.map((item, i) => (
                            <li key={i} className="inclusion-item">{item}</li>
                          ))}
                        </div>
                      ))
                    ) : (
                      <>
                        <li className="inclusion-item">Accommodation as per itinerary</li>
                        <li className="inclusion-item">All meals as specified</li>
                        <li className="inclusion-item">Private air-conditioned vehicle</li>
                        <li className="inclusion-item">English-speaking guide</li>
                        <li className="inclusion-item">All entrance fees</li>
                        <li className="inclusion-item">Bottled water during tours</li>
                      </>
                    )}
                  </ul>
                </div>

                <div className="inclusions-card">
                  <h3 className="card-title orange">✗ What's Not Included</h3>
                  <ul className="exclusions-list">
                    {tourDetails?.exclusions && tourDetails.exclusions.length > 0 ? (
                      tourDetails.exclusions.map((category, idx) => (
                        <div key={idx}>
                          <li className="category-header">{category.category}</li>
                          {category.items.map((item, i) => (
                            <li key={i} className="exclusion-item">{item}</li>
                          ))}
                        </div>
                      ))
                    ) : (
                      <>
                        <li className="exclusion-item">International flights</li>
                        <li className="exclusion-item">Visa fees</li>
                        <li className="exclusion-item">Personal expenses</li>
                        <li className="exclusion-item">Travel insurance</li>
                        <li className="exclusion-item">Tips and gratuities</li>
                        <li className="exclusion-item">Alcoholic beverages</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Practical Info Tab */}
          {activeTab === 'practical' && (
            <div className="practical-tab">
              <h2 className="section-title">Practical Information</h2>
              
              <div className="practical-grid">
                {tourDetails?.practicalInfo?.bestTimeToVisit && (
                  <div className="info-card">
                    <span className="info-icon">🌡️</span>
                    <h4>Best Time to Visit</h4>
                    <p>{tourDetails.practicalInfo.bestTimeToVisit}</p>
                  </div>
                )}

                {tourDetails?.practicalInfo?.difficulty && (
                  <div className="info-card">
                    <span className="info-icon">🏃</span>
                    <h4>Difficulty Level</h4>
                    <p>{tourDetails.practicalInfo.difficulty}</p>
                  </div>
                )}

                {tourDetails?.practicalInfo?.groupSize && (
                  <div className="info-card">
                    <span className="info-icon">👥</span>
                    <h4>Group Size</h4>
                    <p>{tourDetails.practicalInfo.groupSize}</p>
                  </div>
                )}

                {tourDetails?.practicalInfo?.minimumAge && (
                  <div className="info-card">
                    <span className="info-icon">🧒</span>
                    <h4>Minimum Age</h4>
                    <p>{tourDetails.practicalInfo.minimumAge} years</p>
                  </div>
                )}

                {tourDetails?.practicalInfo?.pickupInfo && (
                  <div className="info-card full-width">
                    <span className="info-icon">🚐</span>
                    <h4>Pickup Information</h4>
                    <p>{tourDetails.practicalInfo.pickupInfo}</p>
                  </div>
                )}

                {tourDetails?.practicalInfo?.whatToBring && tourDetails.practicalInfo.whatToBring.length > 0 && (
                  <div className="info-card full-width">
                    <span className="info-icon">🎒</span>
                    <h4>What to Bring</h4>
                    <ul className="bring-list">
                      {tourDetails.practicalInfo.whatToBring.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Show defaults if no practical info */}
                {(!tourDetails?.practicalInfo || Object.keys(tourDetails.practicalInfo).length === 0) && (
                  <>
                    <div className="info-card">
                      <span className="info-icon">🌡️</span>
                      <h4>Best Time to Visit</h4>
                      <p>Year-round, best from December to March</p>
                    </div>
                    <div className="info-card">
                      <span className="info-icon">🏃</span>
                      <h4>Difficulty Level</h4>
                      <p>Moderate</p>
                    </div>
                    <div className="info-card">
                      <span className="info-icon">👥</span>
                      <h4>Group Size</h4>
                      <p>{tour.groupSize}</p>
                    </div>
                    <div className="info-card">
                      <span className="info-icon">🧒</span>
                      <h4>Minimum Age</h4>
                      <p>5 years</p>
                    </div>
                    <div className="info-card full-width">
                      <span className="info-icon">🚐</span>
                      <h4>Pickup Information</h4>
                      <p>Pickup from any hotel in Colombo or Bandaranaike International Airport</p>
                    </div>
                    <div className="info-card full-width">
                      <span className="info-icon">🎒</span>
                      <h4>What to Bring</h4>
                      <ul className="bring-list">
                        <li>Comfortable walking shoes</li>
                        <li>Hat and sunscreen</li>
                        <li>Camera</li>
                        <li>Light jacket</li>
                        <li>Water bottle</li>
                        <li>Insect repellent</li>
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <div className="faq-tab">
              <h2 className="section-title">Frequently Asked Questions</h2>
              
              <div className="faq-list">
                {(tourDetails?.faqs && tourDetails.faqs.length > 0 ? tourDetails.faqs : [
                  {
                    question: "Is this tour suitable for children?",
                    answer: "Yes, this tour is family-friendly. However, some activities may have age restrictions. Please contact us for specific details."
                  },
                  {
                    question: "What is the cancellation policy?",
                    answer: "Free cancellation up to 14 days before the tour. 50% refund for cancellations between 7-14 days. No refund within 7 days."
                  },
                  {
                    question: "Do I need travel insurance?",
                    answer: "Travel insurance is highly recommended for all tours to protect against unforeseen circumstances."
                  }
                ]).map((faq, index) => (
                  <div key={index} className="faq-item">
                    <h4 className="faq-question">{faq.question}</h4>
                    <p className="faq-answer">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Booking CTA */}
        <div className="booking-cta">
          <div className="price-summary">
            <span className="price-label">Tour Price</span>
            <span className="price-amount">{formatPrice(tour.price)}</span>
            <span className="price-note">per person</span>
          </div>
          <button onClick={handleBookNow} className="cta-btn">
            Book This Tour Now
          </button>
          <p className="guarantee">✓ Best Price Guarantee • ✓ Free Cancellation • ✓ Secure Booking</p>
        </div>
      </div>
    </div>
  );
};

export default TourDetailPage;