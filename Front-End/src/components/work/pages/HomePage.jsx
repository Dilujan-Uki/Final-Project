// src/components/work/pages/HomePage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import GuideCard from '../common/GuideCard';
import SriLankaMap from '../common/SriLankaMap';
import BookingForm from '../common/BookingForm';
import SearchBar from '../common/SearchBar';
import SigiriyaImage from '../assets/Sigiriya.jpg'
import './HomePage.css';

// Import your Sigiriya photo
// import sigiriyaBackground from '../assets/sigiriya-rock.jpg';

const HomePage = () => {
  const navigate = useNavigate();
  
  const featuredGuides = [
    {
      id: 1,
      name: "Kamal Perera",
      image: "", // Add image path
      location: "Colombo, Sri Lanka",
      languages: ["English", "Sinhala", "Tamil"],
      rating: 4.9,
      price: 45,
      reviews: 127,
      specialties: ["City Tours", "Food", "History"],
      verified: true,
      experience: "8 years"
    },
    // Add more guides
  ];

  return (
    <div className="home-page">
      {/* Hero Section with Sigiriya Background */}
      <section className="hero-section" style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), url(${SigiriyaImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="hero-overlay">
          <div className="container">
            <div className="hero-content">
              <h1 className="hero-title">
                Discover Authentic Sri Lanka with <span className="highlight">Local Experts</span>
              </h1>
              <p className="hero-subtitle">
                Connect with verified tour guides for memorable experiences at reasonable prices
              </p>
              
              {/* Search Bar */}
              <div className="search-container">
                <SearchBar onSearch={(term) => navigate(`/guides?search=${term}`)} />
              </div>
              
              {/* Quick Stats */}
              <div className="hero-stats">
                <div className="stat">
                  <span className="stat-number">200+</span>
                  <span className="stat-label">Verified Guides</span>
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
              
              {/* Hero Buttons */}
              <div className="hero-buttons">
                <button 
                  className="btn-primary" 
                  onClick={() => navigate('/guides')}
                >
                  Find Your Guide
                </button>
                <button 
                  className="btn-secondary"
                  onClick={() => navigate('/about')}
                >
                  How It Works
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section how-it-works">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Simple Booking Process</h2>
            <p className="section-subtitle">Book your perfect guide in 3 easy steps</p>
          </div>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Search & Select</h3>
              <p>Find guides by location, language, or specialty</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Customize</h3>
              <p>Choose dates and create your perfect itinerary</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Book & Explore</h3>
              <p>Secure booking with 24/7 support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Map */}
      <section className="section map-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Explore Sri Lanka</h2>
            <p className="section-subtitle">Discover amazing destinations across the island</p>
          </div>
          <SriLankaMap />
        </div>
      </section>

      {/* Featured Guides */}
      <section className="section featured-guides bg-light">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Top Rated Guides</h2>
            <p className="section-subtitle">Highly recommended by travelers</p>
          </div>
          <div className="guides-grid">
            {featuredGuides.map(guide => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>
          <div className="text-center">
            <button 
              className="btn-primary" 
              onClick={() => navigate('/guides')}
            >
              View All Guides
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready for Your Sri Lankan Adventure?</h2>
            <p>Book your guide today and create unforgettable memories</p>
            <button 
              className="btn-primary" 
              onClick={() => navigate('/guides')}
            >
              Start Booking Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;