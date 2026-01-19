
// src/pages/TourGuidesPage.jsx
import React from 'react';
import './TourGuidesPage.css';

const TourGuidesPage = () => {
  const tourGuides = [
    {
      id: 1,
      name: "Rajitha Fernando",
      title: "Senior Heritage Guide",
      rating: 4.9,
      reviews: 247,
      specialties: ["Cultural Heritage", "UNESCO Sites"],
      image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop",
      experience: "12 Years Experience",
      languages: ["English", "Sinhala", "Tamil", "French"]
    },
    {
      id: 2,
      name: "Sanduni Perera",
      title: "Wildlife & Nature Expert",
      rating: 4.8,
      reviews: 189,
      specialties: ["Wildlife Tours", "National Parks"],
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop",
      experience: "9 Years Experience",
      languages: ["English", "Sinhala", "German"]
    },
    {
      id: 3,
      name: "Kamal Silva",
      title: "Adventure & Trekking Guide",
      rating: 4.9,
      reviews: 312,
      specialties: ["Mountain Trekking", "Adventure Sports"],
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      experience: "11 Years Experience",
      languages: ["English", "Sinhala", "Japanese"]
    },
    {
      id: 4,
      name: "Nilantha De Silva",
      title: "Cultural & Culinary Guide",
      rating: 4.7,
      reviews: 203,
      specialties: ["Cooking Classes", "Temple Visits"],
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
      experience: "8 Years Experience",
      languages: ["English", "Sinhala", "Tamil", "Japanese"]
    },
    {
      id: 5,
      name: "Chaminda Wickramasinghe",
      title: "Beach & Coastal Expert",
      rating: 4.6,
      reviews: 156,
      specialties: ["Beach Tours", "Snorkeling", "Marine Life"],
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      experience: "9 Years Experience",
      languages: ["English", "Sinhala", "Italian"]
    },
    {
      id: 6,
      name: "Priya Jayawardena",
      title: "Tea Plantation Specialist",
      rating: 4.8,
      reviews: 178,
      specialties: ["Tea Plantations", "Hill Country", "Tea Tasting"],
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop",
      experience: "11 Years Experience",
      languages: ["English", "Sinhala", "Tamil", "Chinese"]
    }
  ];

  const whyChooseGuides = [
    {
      title: "Licensed & Certified",
      description: "All guides are government-licensed professionals"
    },
    {
      title: "Multilingual",
      description: "Fluent in multiple languages for global guests"
    },
    {
      title: "Local Experts",
      description: "Deep knowledge of local culture and hidden gems"
    },
    {
      title: "Highly Rated",
      description: "Consistently excellent reviews from travelers"
    }
  ];

  const categories = [
    "Cultural Heritage",
    "Wildlife Tours", 
    "Adventure Sports",
    "Food Tours",
    "Beach Tours",
    "Tea Plantations"
  ];

  return (
    <div className="tour-guides-page">
      {/* Hero Section */}
      <section className="guides-hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Meet Our Expert Tour Guides</h1>
            <p className="hero-subtitle">
              Licensed professionals with deep local knowledge and passion for Sri Lanka
            </p>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="categories-section">
        <div className="container">
          <div className="categories-header">
            <h2 className="section-title">Browse by Specialty</h2>
          </div>
          <div className="categories-grid">
            {categories.map((category, index) => (
              <button key={index} className="category-btn">
                {category}
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
            <p className="section-subtitle">All guides are government-licensed and highly experienced</p>
          </div>
          
          <div className="guides-grid">
            {tourGuides.map((guide) => (
              <div key={guide.id} className="guide-card">
                <div className="guide-image">
                  <img src={guide.image} alt={guide.name} className="guide-img" />
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
                    <span className="rating-text">{guide.rating} • {guide.reviews} reviews</span>
                  </div>
                  
                  <div className="guide-details">
                    <div className="detail">
                      <span className="detail-label">Experience:</span>
                      <span className="detail-value">{guide.experience}</span>
                    </div>
                    <div className="detail">
                      <span className="detail-label">Languages:</span>
                      <span className="detail-value">{guide.languages.join(', ')}</span>
                    </div>
                  </div>
                  
                  <div className="guide-specialties">
                    {guide.specialties.map((specialty, index) => (
                      <span key={index} className="specialty-tag">{specialty}</span>
                    ))}
                  </div>
                  
                  <div className="guide-actions">
                    <button className="btn-primary">Book Guide</button>
                    <button className="btn-secondary">View Profile</button>
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
