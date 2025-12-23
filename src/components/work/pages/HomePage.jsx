// src/components/work/pages/HomePage.jsx
import React from 'react';
import GuideCard from '../GuideCard';
import SriLankaMap from '../SriLankaMap';
import BookingForm from '../BookingForm';
import '../styles/HomePage.css';

// Sample data - in real app, this would come from API
const featuredGuides = [
  {
    id: 1,
    name: "Kamal Perera",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    location: "Colombo, Sri Lanka",
    languages: ["English", "Sinhala", "Tamil"],
    rating: 4.9,
    price: 45,
    reviews: 127,
    specialties: ["City Tours", "Food", "History"],
    verified: true,
    experience: "8 years"
  },
  {
    id: 2,
    name: "Priya Fernando",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop",
    location: "Kandy, Sri Lanka",
    languages: ["English", "Sinhala", "French"],
    rating: 4.8,
    price: 40,
    reviews: 89,
    specialties: ["Cultural Tours", "Temples", "Tea Plantations"],
    verified: true,
    experience: "6 years"
  },
  {
    id: 3,
    name: "Ravi Silva",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    location: "Galle, Sri Lanka",
    languages: ["English", "German", "Sinhala"],
    rating: 4.7,
    price: 55,
    reviews: 103,
    specialties: ["Beach Tours", "Photography", "Surfing"],
    verified: true,
    experience: "10 years"
  },
];

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Hero Section with Sri Lanka Background */}
      <section className="hero-section">
        <div className="hero-overlay">
          <div className="container">
            <div className="hero-content">
              <h1 className="hero-title">
                Discover Sri Lanka with <span className="highlight">Local Experts</span>
              </h1>
              <p className="hero-subtitle">
                Connect with verified tour guides for authentic experiences at reasonable prices
              </p>
              <div className="hero-stats">
                <div className="stat">
                  <span className="stat-number">200+</span>
                  <span className="stat-label">Local Guides</span>
                </div>
                <div className="stat">
                  <span className="stat-number">4.8★</span>
                  <span className="stat-label">Average Rating</span>
                </div>
                <div className="stat">
                  <span className="stat-number">50+</span>
                  <span className="stat-label">Destinations</span>
                </div>
              </div>
              <div className="hero-buttons">
                <button className="btn-primary">
                  Find Your Guide
                </button>
                <button className="btn-secondary">
                  How It Works
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section-padding bg-light">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Book your perfect guide in 3 simple steps</p>
          </div>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Search & Select</h3>
              <p>Browse verified local guides by location, language, and specialty</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Customize Your Tour</h3>
              <p>Choose dates, duration, and special requests for your perfect trip</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Book & Explore</h3>
              <p>Secure booking with 24/7 support. Enjoy authentic Sri Lanka!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Sri Lanka Map */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Explore Sri Lanka</h2>
            <p className="section-subtitle">Click on any destination to find local guides</p>
          </div>
          <SriLankaMap />
        </div>
      </section>

      {/* Featured Guides */}
      <section className="section-padding bg-light">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Local Guides</h2>
            <p className="section-subtitle">Highly rated by international tourists</p>
          </div>
          <div className="guides-grid">
            {featuredGuides.map(guide => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>
          <div className="text-center mt-12">
            <button className="btn-primary">
              View All Guides
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Reasonable & Transparent Pricing</h2>
            <p className="section-subtitle">No hidden fees. Everything included in one price</p>
          </div>
          <div className="pricing-cards">
            <div className="pricing-card">
              <h3>Half Day Tour</h3>
              <div className="price">$25-40</div>
              <p>4-5 hours</p>
              <ul>
                <li>✅ City walking tour</li>
                <li>✅ Local market visit</li>
                <li>✅ Food tasting included</li>
              </ul>
            </div>
            <div className="pricing-card featured">
              <h3>Full Day Tour</h3>
              <div className="price">$40-60</div>
              <p>8-10 hours</p>
              <ul>
                <li>✅ Multiple destinations</li>
                <li>✅ Lunch included</li>
                <li>✅ Transportation arranged</li>
                <li>✅ Photo assistance</li>
              </ul>
            </div>
            <div className="pricing-card">
              <h3>Multi-Day Package</h3>
              <div className="price">$150-300</div>
              <p>3-5 days</p>
              <ul>
                <li>✅ Custom itinerary</li>
                <li>✅ Hotel arrangements</li>
                <li>✅ All meals included</li>
                <li>✅ 24/7 guide support</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form Preview */}
      <section className="section-padding bg-light">
        <div className="container">
          <div className="booking-preview">
            <div className="booking-info">
              <h2>Ready to Book Your Adventure?</h2>
              <p>Fill out this simple form to request a booking. Our guides typically respond within 4 hours.</p>
              <div className="benefits">
                <div className="benefit">
                  <span>✓</span> Best Price Guarantee
                </div>
                <div className="benefit">
                  <span>✓</span> 24/7 Customer Support
                </div>
                <div className="benefit">
                  <span>✓</span> Free Cancellation (24h)
                </div>
              </div>
            </div>
            <div className="booking-form-wrapper">
              <BookingForm price={45} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;