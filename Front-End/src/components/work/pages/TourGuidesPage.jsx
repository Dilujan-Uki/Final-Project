// src/pages/TourGuidesPage.jsx - UPDATED with 6 guides and imported images
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './TourGuidesPage.css';

// Import guide images
import Rajitha from '../assets/Rajitha.png';
import Kamal from '../assets/Kamal.png';
import Nimal from '../assets/Nimal.png';
import Sanduni from '../assets/Sanduni.png';
import Chaminda from '../assets/Chaminda.png';
import Priya from '../assets/Priya.png';

const TourGuidesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  // Get tour data from URL if coming from a tour
  const tourId = queryParams.get('tour');
  const tourName = queryParams.get('name');
  const tourDuration = queryParams.get('duration');
  const tourPricePerDay = queryParams.get('pricePerDay');

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTour, setSelectedTour] = useState(null);

  // Complete guides data with 6 guides and imported images
  const guides = [
    {
      id: 1,
      name: "Rajitha Fernando",
      rating: 4.9,
      reviews: 247,
      specialties: ["Cultural Heritage", "UNESCO Sites", "Ancient History", "Temple Architecture"],
      image: Rajitha,
      experience: "12 Years",
      languages: ["English", "Sinhala", "Tamil", "French"],
      hourlyRate: 25,
      dailyRate: 80,
      category: "cultural",
      bio: "Expert in Sri Lankan ancient civilizations with Masters in Archaeology"
    },
    {
      id: 2,
      name: "Kamal Silva",
      rating: 4.8,
      reviews: 189,
      specialties: ["Wildlife", "Bird Watching", "Safari", "Photography", "Conservation"],
      image: Kamal ,
      experience: "8 Years",
      languages: ["English", "Sinhala"],
      hourlyRate: 20,
      dailyRate: 70,
      category: "wildlife",
      bio: "Former wildlife researcher turned guide, specialist in leopards and elephants"
    },
    {
      id: 3,
      name: "Nimaltha Perera",
      rating: 4.7,
      reviews: 156,
      specialties: ["Adventure", "Hiking", "Camping", "Mountain Biking", "Rock Climbing"],
      image: Nimal,
      experience: "6 Years",
      languages: ["English", "Sinhala", "Tamil"],
      hourlyRate: 18,
      dailyRate: 65,
      category: "adventure",
      bio: "Certified mountain guide with extensive experience in Sri Lanka's hill country"
    },
    {
      id: 4,
      name: "Sanduni Perera",
      rating: 4.9,
      reviews: 203,
      specialties: ["Temple Tours", "History", "Archaeology", "Art", "Traditional Crafts"],
      image: Sanduni,
      experience: "10 Years",
      languages: ["English", "Sinhala", "Japanese"],
      hourlyRate: 22,
      dailyRate: 75,
      category: "cultural",
      bio: "Specializes in Buddhist heritage and traditional Sri Lankan arts"
    },
    {
      id: 5,
      name: "Chaminda Wickramasinghe",
      rating: 4.8,
      reviews: 178,
      specialties: ["Beach Tours", "Snorkeling", "Diving", "Whale Watching", "Surfing"],
      image: Chaminda,
      experience: "7 Years",
      languages: ["English", "Sinhala", "German"],
      hourlyRate: 19,
      dailyRate: 68,
      category: "beach",
      bio: "PADI certified diving instructor with expertise in marine life"
    },
    {
      id: 6,
      name: "Priya Jayawardena",
      rating: 4.9,
      reviews: 167,
      specialties: ["Photography", "Wildlife", "Landscape", "Cultural Events", "Sunrise Spots"],
      image: Priya,
      experience: "9 Years",
      languages: ["English", "Sinhala", "French"],
      hourlyRate: 24,
      dailyRate: 82,
      category: "photography",
      bio: "Professional photographer who knows the best spots for amazing shots"
    }
  ];

  // Set selected tour from URL params
  useEffect(() => {
    if (tourId && tourName) {
      setSelectedTour({
        id: tourId,
        name: decodeURIComponent(tourName),
        duration: tourDuration,
        pricePerDay: tourPricePerDay
      });
      
      // Store in localStorage for persistence
      localStorage.setItem('selectedTour', JSON.stringify({
        id: tourId,
        name: decodeURIComponent(tourName),
        duration: parseInt(tourDuration) || 3,
        pricePerDay: parseInt(tourPricePerDay) || 80
      }));
    }
  }, [tourId, tourName, tourDuration, tourPricePerDay]);

  const categories = [
    { id: 'all', label: 'All Guides', icon: '👥' },
    { id: 'cultural', label: 'Cultural', icon: '🏛️' },
    { id: 'wildlife', label: 'Wildlife', icon: '🦁' },
    { id: 'adventure', label: 'Adventure', icon: '🏔️' },
    { id: 'beach', label: 'Beach', icon: '🏖️' },
    { id: 'photography', label: 'Photography', icon: '📸' }
  ];

  const filteredGuides = selectedCategory === 'all' 
    ? guides 
    : guides.filter(guide => guide.category === selectedCategory);

  const handleSelectGuide = (guide) => {
    // Get selected tour from state or localStorage
    const tour = selectedTour || JSON.parse(localStorage.getItem('selectedTour') || '{}');
    
    if (!tour.id) {
      alert('Please select a tour first');
      navigate('/tours');
      return;
    }

    // Navigate to booking page with both tour and guide
    navigate(`/booking?tour=${tour.id}&name=${encodeURIComponent(tour.name)}&duration=${tour.duration}&pricePerDay=${tour.pricePerDay}&guide=${guide.id}&guideName=${encodeURIComponent(guide.name)}&guideDailyRate=${guide.dailyRate}`);
  };

  const handleViewGuideDetails = (guideId) => {
    const guide = guides.find(g => g.id === guideId);
    if (guide) {
      localStorage.setItem('selectedGuideDetail', JSON.stringify(guide));
    }
    navigate(`/tour-guide/${guideId}`);
  };

  const handleChangeTour = () => {
    navigate('/tours');
  };

  return (
    <div className="tour-guides-page">
      {/* Hero Section */}
      <section className="guides-hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title1">Our Expert Tour Guides</h1>
            <p className="hero-subtitle1">
              Meet our certified local guides who will make your Sri Lankan journey unforgettable
            </p>
          </div>
        </div>
      </section>

      {/* Selected Tour Info - Show only if coming from a tour */}
      {selectedTour && (
        <section className="selected-tour-section">
          <div className="container">
            <div className="selected-tour-card">
              <h3>
                Selected Tour: <span>{selectedTour.name}</span>
              </h3>
              <div className="tour-summary">
                <span>📅 {selectedTour.duration} days</span>
                <span>💰 ${selectedTour.pricePerDay}/day per person</span>
                <button onClick={handleChangeTour} className="btn-secondary">
                  Change Tour
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="container">
        {/* Categories Filter */}
        <section className="categories-section">
          <div className="categories-header">
            <h2>Find Your Perfect Guide</h2>
          </div>
          <div className="categories-grid">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span>{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>
        </section>

        {/* Guides Grid */}
        <section className="guides-section">
          <div className="section-header">
            <h2 className="section-title">
              {selectedCategory === 'all' ? 'All Tour Guides' : `${categories.find(c => c.id === selectedCategory)?.label} Guides`}
            </h2>
            <p className="section-subtitle">
              {filteredGuides.length} certified guides available
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
                    <span className="stars">{'★'.repeat(Math.floor(guide.rating))}</span>
                    <span className="rating-text">{guide.reviews} reviews</span>
                  </div>
                  
                  <div className="guide-details">
                    <div className="detail">
                      <span className="detail-label">Experience</span>
                      <span className="detail-value">{guide.experience}</span>
                    </div>
                    <div className="detail">
                      <span className="detail-label">Languages</span>
                      <span className="detail-value">{guide.languages.join(', ')}</span>
                    </div>
                    <div className="detail">
                      <span className="detail-label">Daily Rate</span>
                      <span className="detail-value">${guide.dailyRate}/day</span>
                    </div>
                  </div>
                  
                  <div className="guide-specialties">
                    {guide.specialties.map((specialty, index) => (
                      <span key={index} className="specialty-tag">{specialty}</span>
                    ))}
                  </div>
                  
                  <div className="guide-bio-preview">
                    <p>{guide.bio}</p>
                  </div>
                  
                  <div className="guide-actions">
                    <button 
                      onClick={() => handleSelectGuide(guide)}
                      className="btn-primary"
                      disabled={!selectedTour && !localStorage.getItem('selectedTour')}
                    >
                      Select Guide
                    </button>
                    <button 
                      onClick={() => handleViewGuideDetails(guide.id)}
                      className="btn-secondary"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose Our Guides */}
        <section className="why-choose-section">
          <div className="section-header">
            <h2 className="section-title">Why Choose Our Guides?</h2>
            <p className="section-subtitle">
              All our guides are licensed, experienced, and passionate about sharing Sri Lanka's beauty
            </p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <h3 className="feature-title">✓ Licensed Professionals</h3>
              <p className="feature-description">
                All guides are certified by the Sri Lanka Tourism Development Authority
              </p>
            </div>
            <div className="feature-card">
              <h3 className="feature-title">✓ Local Knowledge</h3>
              <p className="feature-description">
                Deep understanding of local culture, history, and hidden gems
              </p>
            </div>
            <div className="feature-card">
              <h3 className="feature-title">✓ Multi-lingual</h3>
              <p className="feature-description">
                Guides fluent in English, French, German, Japanese, and more
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TourGuidesPage;