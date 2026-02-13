// src/pages/TourGuidesPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import './TourGuidesPage.css';
import Rajitha from '/home/uki-dsa-01/LESSONS/Final-Project/Front-End/src/components/work/assets/Rajitha.png';
import Kamal from '/home/uki-dsa-01/LESSONS/Final-Project/Front-End/src/components/work/assets/Kamal.png';
import Nimal from '/home/uki-dsa-01/LESSONS/Final-Project/Front-End/src/components/work/assets/Nimal.png';
import Sanduni from '/home/uki-dsa-01/LESSONS/Final-Project/Front-End/src/components/work/assets/Sanduni.png';
import Chaminda from '/home/uki-dsa-01/LESSONS/Final-Project/Front-End/src/components/work/assets/Chaminda.png';
import Priya from '/home/uki-dsa-01/LESSONS/Final-Project/Front-End/src/components/work/assets/Priya.png';

const TourGuidesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  const [selectedTour, setSelectedTour] = useState(null);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [filteredGuides, setFilteredGuides] = useState([]);

  // Get tour details from URL parameters
  const tourId = queryParams.get('tour');
  const tourName = queryParams.get('name');
  const duration = parseInt(queryParams.get('duration')) || 3;
  const pricePerDay = parseInt(queryParams.get('pricePerDay')) || 80;

  useEffect(() => {
    if (tourId && tourName) {
      const tourData = {
        id: tourId,
        name: tourName,
        duration: duration,
        pricePerDay: pricePerDay,
        basePrice: duration * pricePerDay
      };
      setSelectedTour(tourData);
      localStorage.setItem('selectedTour', JSON.stringify(tourData));
    } else {
      const savedTour = localStorage.getItem('selectedTour');
      if (savedTour) {
        setSelectedTour(JSON.parse(savedTour));
      }
    }
  }, [tourId, tourName, duration, pricePerDay]);

  const tourGuides = [
    {
      id: 1,
      name: "Rajitha Fernando",
      title: "Senior Heritage Guide",
      rating: 4.9,
      reviews: 247,
      specialties: ["Cultural Heritage", "UNESCO Sites", "Ancient History"],
      image: Rajitha,
      experience: "12 Years Experience",
      languages: ["English", "Sinhala", "Tamil", "French"],
      hourlyRate: 25,
      dailyRate: 60,
      description: "Expert in Sri Lankan cultural heritage with deep knowledge of ancient civilizations."
    },
    {
      id: 2,
      name: "Kamal Silva",
      title: "Wildlife & Nature Expert",
      rating: 4.8,
      reviews: 189,
      specialties: ["Wildlife Tours", "National Parks", "Bird Watching"],
      image: Kamal,
      experience: "9 Years Experience",
      languages: ["English", "Sinhala", "German"],
      hourlyRate: 22,
      dailyRate: 50,
      description: "Passionate wildlife photographer and nature conservationist."
    },
    {
      id: 3,
      name: "Nimal De Silva",
      title: "Adventure & Trekking Guide",
      rating: 4.9,
      reviews: 312,
      specialties: ["Mountain Trekking", "Adventure Sports", "Camping"],
      image: Nimal,
      experience: "11 Years Experience",
      languages: ["English", "Sinhala", "Japanese"],
      hourlyRate: 28,
      dailyRate: 60,
      description: "Certified adventure guide specializing in mountain treks and outdoor activities."
    },
    {
      id: 4,
      name: "Sanduni Perera",
      title: "Cultural & Culinary Guide",
      rating: 4.7,
      reviews: 203,
      specialties: ["Cooking Classes", "Temple Visits", "Local Markets"],
      image: Sanduni,
      experience: "8 Years Experience",
      languages: ["English", "Sinhala", "Tamil", "Japanese"],
      hourlyRate: 20,
      dailyRate: 50,
      description: "Food enthusiast specializing in Sri Lankan cuisine and culinary traditions."
    },
    {
      id: 5,
      name: "Chaminda Wickramasinghe",
      title: "Beach & Coastal Expert",
      rating: 4.6,
      reviews: 156,
      specialties: ["Beach Tours", "Snorkeling", "Marine Life"],
      image: Chaminda,
      experience: "9 Years Experience",
      languages: ["English", "Sinhala", "Italian"],
      hourlyRate: 18,
      dailyRate: 40,
      description: "Marine biologist and certified diver with extensive coastal knowledge."
    },
    {
      id: 6,
      name: "Priya Jayawardena",
      title: "Tea Plantation Specialist",
      rating: 4.8,
      reviews: 178,
      specialties: ["Tea Plantations", "Hill Country", "Tea Tasting"],
      image: Priya,
      experience: "11 Years Experience",
      languages: ["English", "Sinhala", "Tamil", "Chinese"],
      hourlyRate: 23,
      dailyRate: 50,
      description: "Third-generation tea planter with deep knowledge of Ceylon tea production."
    }
  ];

  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredGuides(tourGuides);
    } else {
      setFilteredGuides(tourGuides.filter(guide => 
        guide.specialties.some(s => s.includes(activeCategory))
      ));
    }
  }, [activeCategory]);

  const categories = [
    { id: 'all', name: 'All Guides', icon: '👥' },
    { id: 'Cultural', name: 'Cultural', icon: '🏛️' },
    { id: 'Wildlife', name: 'Wildlife', icon: '🦁' },
    { id: 'Adventure', name: 'Adventure', icon: '🏔️' },
    { id: 'Beach', name: 'Beach', icon: '🏖️' },
    { id: 'Tea', name: 'Tea Plantations', icon: '🍃' },
    { id: 'Culinary', name: 'Culinary', icon: '🍛' }
  ];

  const handleSelectGuide = (guide) => {
    setSelectedGuide(guide);
    localStorage.setItem('selectedGuide', JSON.stringify(guide));
    
    if (selectedTour) {
      navigate(`/payment?tour=${selectedTour.id}&name=${encodeURIComponent(selectedTour.name)}&duration=${selectedTour.duration}&pricePerDay=${selectedTour.pricePerDay}&guide=${guide.id}&guideName=${encodeURIComponent(guide.name)}&guideDailyRate=${guide.dailyRate}`);
    }
  };

  const handleViewProfile = (guideId) => {
    navigate(`/tour-guide/${guideId}`);
  };

  const whyChooseGuides = [
    {
      title: "Licensed & Certified",
      description: "All guides are government-licensed professionals with official certification",
      icon: "📜"
    },
    {
      title: "Multilingual Experts",
      description: "Fluent in multiple languages for global guests with cultural sensitivity",
      icon: "🌐"
    },
    {
      title: "Local Knowledge",
      description: "Deep understanding of hidden gems and authentic experiences",
      icon: "💎"
    },
    {
      title: "Highly Rated",
      description: "Consistently excellent reviews from travelers worldwide",
      icon: "⭐"
    }
  ];

  return (
    <div className="tour-guides-page">
      {/* Hero Section */}
      <section className="guides-hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Meet Your Expert Guides</h1>
            <p className="hero-subtitle">
              {selectedTour 
                ? `You're booking: ${decodeURIComponent(selectedTour.name)} - ${selectedTour.duration} days`
                : "Choose from our licensed professionals with deep local knowledge"
              }
            </p>
          </div>
        </div>
      </section>

      {/* Selected Tour Info */}
      {selectedTour && (
        <section className="selected-tour-section">
          <div className="container">
            <div className="selected-tour-card">
              <h3>
                <span>🎫</span> Selected Tour: <span>{decodeURIComponent(selectedTour.name)}</span>
              </h3>
              <div className="tour-summary">
                <span>⏱️ {selectedTour.duration} days</span>
                <span>💰 ${selectedTour.basePrice}/person</span>
                <button 
                  className="btn-secondary" 
                  onClick={() => navigate('/tours')}
                >
                  Change Tour
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Categories Filter */}
      <section className="categories-section">
        <div className="container">
          <div className="categories-header">
            <h2 className="section-title">Browse by Specialty</h2>
          </div>
          <div className="categories-grid">
            {categories.map((category) => (
              <button 
                key={category.id} 
                className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                <span>{category.icon}</span> {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Guides Grid */}
      <section className="guides-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Professional Tour Guides</h2>
            <p className="section-subtitle">
              Select a guide for your tour. All guides are government-licensed and highly experienced.
            </p>
          </div>
          
          <div className="guides-grid">
            {filteredGuides.map((guide) => (
              <div key={guide.id} className="guide-card">
                <div className="guide-image">
                  <img src={guide.image} alt={guide.name} className="guide-img" />
                  <div className="guide-rating-badge">
                    <span>⭐ {guide.rating}</span>
                  </div>
                </div>
                
                <div className="guide-content">
                  <div className="guide-header">
                    <h3 className="guide-name">{guide.name}</h3>
                    <span className="guide-title">{guide.title}</span>
                  </div>
                  
                  <div className="guide-rating">
                    <div className="stars">
                      {'★'.repeat(Math.floor(guide.rating))}
                      {'☆'.repeat(5 - Math.floor(guide.rating))}
                    </div>
                    <span className="rating-text">({guide.reviews} reviews)</span>
                  </div>
                  
                  <div className="guide-details">
                    <div className="detail">
                      <span className="detail-label">Experience:</span>
                      <span className="detail-value">{guide.experience}</span>
                    </div>
                    <div className="detail">
                      <span className="detail-label">Languages:</span>
                      <span className="detail-value">{guide.languages.slice(0, 3).join(', ')}</span>
                    </div>
                    <div className="detail">
                      <span className="detail-label">Daily Rate:</span>
                      <span className="detail-value">${guide.dailyRate}/day</span>
                    </div>
                  </div>
                  
                  <div className="guide-specialties">
                    {guide.specialties.map((specialty, index) => (
                      <span key={index} className="specialty-tag">{specialty}</span>
                    ))}
                  </div>
                  
                  <div className="guide-actions">
                    <button 
                      className="btn-primary"
                      onClick={() => handleSelectGuide(guide)}
                      disabled={!selectedTour}
                    >
                      {selectedTour ? 'Select This Guide' : 'Select Tour First'}
                    </button>
                    <button 
                      className="btn-secondary"
                      onClick={() => handleViewProfile(guide.id)}
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Our Guides */}
      <section className="why-choose-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose Our Guides?</h2>
          </div>
          <div className="features-grid">
            {whyChooseGuides.map((feature, index) => (
              <div key={index} className="feature-card">
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TourGuidesPage;