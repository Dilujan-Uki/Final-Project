// src/components/work/pages/GuideDetail.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookingForm from '../common/BookingForm';
import Testimonials from '../common/Testimonials';
import SriLankaMap from '../common/SriLankaMap';
import { guides } from '../data/guides';
import './GuideDetail.css';


const GuideDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Find guide by ID
  const guide = guides.find(g => g.id === parseInt(id)) || guides[0];

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      location: "London, UK",
      rating: 5,
      date: "2024-01-15",
      comment: "Kamal was absolutely amazing! His knowledge of Colombo's history and food scene was incredible. The street food tour was the highlight of our trip!"
    },
    {
      id: 2,
      name: "Michael Chen",
      location: "Singapore",
      rating: 4,
      date: "2024-01-10",
      comment: "Very professional and punctual. Kamal showed us hidden gems we would never have found on our own. Highly recommended!"
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      location: "Madrid, Spain",
      rating: 5,
      date: "2024-01-05",
      comment: "We booked Kamal for 3 days and he planned the perfect itinerary. His English is excellent and he's very patient with questions."
    }
  ];

  const tours = [
    {
      id: 1,
      name: "Colombo City Tour",
      duration: "5 hours",
      price: "$45",
      highlights: ["Gangaramaya Temple", "Independence Square", "Local Markets", "Street Food"]
    },
    {
      id: 2,
      name: "Colombo Food Experience",
      duration: "4 hours",
      price: "$55",
      highlights: ["Local Eateries", "Street Food", "Spice Market", "Cooking Demo"]
    },
    {
      id: 3,
      name: "Full Day Colombo Explorer",
      duration: "8 hours",
      price: "$85",
      highlights: ["Historical Sites", "Shopping", "Lunch Included", "Cultural Show"]
    }
  ];

  return (
    <div className="guide-detail-page">
      {/* Back Button */}
      <div className="container">
        <button className="back-btn" onClick={() => navigate('/guides')}>
          ← Back to Guides
        </button>
      </div>

      {/* Hero Section */}
      <section className="guide-hero">
        <div className="container">
          <div className="guide-hero-content">
            <div className="guide-profile">
              <div className="profile-image-container">
                <div className="profile-image-container">
                  {/* FIXED: Replace require() with a placeholder div */}
                  <div style={{
                    width: '200px',
                    height: '200px',
                    borderRadius: '20px',
                    background: `linear-gradient(135deg, #2c5f2d, #17B794)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '3rem',
                    border: '4px solid white',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
                  }}>
                    {guide.name.split(' ')[0].charAt(0)}
                  </div>
                  {guide.verified && (
                    <div className="verified-badge">
                      <span className="verified-icon">✓</span>
                      Verified Guide
                    </div>
                  )}
                </div>
                {guide.verified && (
                  <div className="verified-badge">
                    <span className="verified-icon">✓</span>
                    Verified Guide
                  </div>
                )}
              </div>

              <div className="profile-info">
                <div className="profile-header">
                  <div>
                    <h1 className="guide-name">{guide.name}</h1>
                    <div className="guide-location">
                      <span className="location-icon">📍</span>
                      {guide.location}, Sri Lanka
                    </div>
                  </div>
                  <div className="profile-badge">{guide.badge}</div>
                </div>

                <div className="profile-stats">
                  <div className="stat">
                    <div className="stat-value">{guide.rating}</div>
                    <div className="stat-label">
                      <div className="rating-stars">★★★★★</div>
                      <span>({guide.reviews} reviews)</span>
                    </div>
                  </div>

                  <div className="stat">
                    <div className="stat-value">{guide.experience}</div>
                    <div className="stat-label">Experience</div>
                  </div>

                  <div className="stat">
                    <div className="stat-value">{guide.responseTime}</div>
                    <div className="stat-label">Response Time</div>
                  </div>

                  <div className="stat">
                    <div className="stat-value">${guide.price}/day</div>
                    <div className="stat-label">Starting Price</div>
                  </div>
                </div>

                <div className="profile-tags">
                  <div className="tag-group">
                    <span className="tag-label">Languages:</span>
                    <div className="tags">
                      {guide.languages.map((lang, index) => (
                        <span key={index} className="tag">{lang}</span>
                      ))}
                    </div>
                  </div>

                  <div className="tag-group">
                    <span className="tag-label">Specialties:</span>
                    <div className="tags">
                      {guide.specialties.map((spec, index) => (
                        <span key={index} className="tag">{spec}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="guide-content">
          {/* Main Content */}
          <main className="guide-main">
            {/* Tabs Navigation */}
            <div className="guide-tabs">
              <button
                className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={`tab-btn ${activeTab === 'tours' ? 'active' : ''}`}
                onClick={() => setActiveTab('tours')}
              >
                Available Tours
              </button>
              <button
                className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews ({guide.reviews})
              </button>
              <button
                className={`tab-btn ${activeTab === 'location' ? 'active' : ''}`}
                onClick={() => setActiveTab('location')}
              >
                Location
              </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === 'overview' && (
                <div className="overview-tab">
                  <div className="about-section">
                    <h2>About {guide.name}</h2>
                    <p className="guide-description">{guide.description}</p>

                    <div className="about-details">
                      <div className="detail-item">
                        <span className="detail-label">Years Guiding:</span>
                        <span className="detail-value">{guide.experience}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Response Rate:</span>
                        <span className="detail-value">98%</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Availability:</span>
                        <span className="detail-value available">Available Now</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Group Size:</span>
                        <span className="detail-value">Up to 8 people</span>
                      </div>
                    </div>
                  </div>

                  <div className="whats-included">
                    <h3>What's Included</h3>
                    <ul>
                      <li>✓ Professional guiding services</li>
                      <li>✓ Local insights and tips</li>
                      <li>✓ Customizable itinerary</li>
                      <li>✓ Photo assistance</li>
                      <li>✓ Restaurant recommendations</li>
                      <li>✓ 24/7 support during tour</li>
                    </ul>
                  </div>

                  <div className="whats-not-included">
                    <h3>What's Not Included</h3>
                    <ul>
                      <li>✗ Transportation (can be arranged)</li>
                      <li>✗ Entrance fees to attractions</li>
                      <li>✗ Meals and drinks</li>
                      <li>✗ Accommodation</li>
                      <li>✗ Travel insurance</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'tours' && (
                <div className="tours-tab">
                  <div className="tours-grid">
                    {tours.map(tour => (
                      <div key={tour.id} className="tour-card">
                        <h3 className="tour-name">{tour.name}</h3>
                        <div className="tour-price">{tour.price}</div>
                        <div className="tour-duration">{tour.duration}</div>
                        <div className="tour-highlights">
                          <h4>Highlights:</h4>
                          <ul>
                            {tour.highlights.map((highlight, index) => (
                              <li key={index}>{highlight}</li>
                            ))}
                          </ul>
                        </div>
                        <button className="select-tour-btn">
                          Select This Tour
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="custom-tour">
                    <h3>Custom Tour Request</h3>
                    <p>Don't see what you're looking for? Contact {guide.name} directly to create a custom itinerary.</p>
                    <button className="custom-tour-btn">
                      Request Custom Tour
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="reviews-tab">
                  <Testimonials testimonials={testimonials} />

                  <div className="review-summary">
                    <h3>Review Summary</h3>
                    <div className="summary-stats">
                      <div className="summary-stat">
                        <div className="summary-value">5.0</div>
                        <div className="summary-label">Knowledge</div>
                      </div>
                      <div className="summary-stat">
                        <div className="summary-value">4.9</div>
                        <div className="summary-label">Communication</div>
                      </div>
                      <div className="summary-stat">
                        <div className="summary-value">5.0</div>
                        <div className="summary-label">Punctuality</div>
                      </div>
                      <div className="summary-stat">
                        <div className="summary-value">4.8</div>
                        <div className="summary-label">Value</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'location' && (
                <div className="location-tab">
                  <h3>Operating Area</h3>
                  <p>{guide.name} operates primarily in and around {guide.location}.</p>

                  <div className="location-map">
                    <SriLankaMap city={guide.location} />
                  </div>

                  <div className="location-details">
                    <h4>Popular Destinations Covered:</h4>
                    <div className="destination-tags">
                      <span className="dest-tag">Colombo Fort</span>
                      <span className="dest-tag">Galle Face Green</span>
                      <span className="dest-tag">Pettah Market</span>
                      <span className="dest-tag">Beira Lake</span>
                      <span className="dest-tag">National Museum</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>

          {/* Booking Sidebar */}
          <aside className="booking-sidebar">
            <BookingForm guide={guide} price={guide.price} />

            <div className="safety-info">
              <h3>Safety First</h3>
              <div className="safety-item">
                <span className="safety-icon">✅</span>
                <span>Verified identity & background check</span>
              </div>
              <div className="safety-item">
                <span className="safety-icon">✅</span>
                <span>Secure online payments</span>
              </div>
              <div className="safety-item">
                <span className="safety-icon">✅</span>
                <span>24/7 customer support</span>
              </div>
              <div className="safety-item">
                <span className="safety-icon">✅</span>
                <span>Guide rating system</span>
              </div>
            </div>

            <div className="quick-contact">
              <h3>Quick Questions?</h3>
              <button className="message-btn">
                ✉️ Message {guide.name.split(' ')[0]}
              </button>
              <p className="response-note">Typically responds within {guide.responseTime}</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default GuideDetail;