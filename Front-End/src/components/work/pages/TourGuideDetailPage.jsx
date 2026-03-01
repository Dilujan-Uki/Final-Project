// src/pages/TourGuideDetailPage.jsx - FIXED
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TourGuideDetailPage.css';

const TourGuideDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch the guide data based on the id
    const fetchGuide = async () => {
      try {
        // Uncomment when your API is ready
        const response = await fetch(`http://localhost:5000/api/guides/${id}`);
        const data = await response.json();
        setGuide(data.data);
        
        // For now, just log that we're fetching
        console.log(`Fetching guide with ID: ${id}`);
        
        // Simulate loading
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching guide:', error);
        setLoading(false);
      }
    };

    fetchGuide();
  }, [id]);

  // Mock data - In a real app, this would come from the API
  const guideData = {
    id: 1,
    name: "Rajitha Fernando",
    title: "Senior Heritage Guide",
    rating: 4.9,
    reviews: 247,
    specialties: ["Cultural Heritage", "UNESCO Sites", "Ancient History", "Temple Architecture"],
    image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=600&h=600&fit=crop",
    experience: "12 Years Experience",
    languages: ["English (Fluent)", "Sinhala (Native)", "Tamil (Fluent)", "French (Conversational)"],
    hourlyRate: 25,
    dailyRate: 50,
    description: "Rajitha is a certified cultural heritage guide with over 12 years of experience specializing in Sri Lanka's ancient civilizations. He holds a Masters in Archaeology from the University of Peradeniya.",
    bio: "Born and raised in Kandy, Rajitha developed a passion for history from a young age. He has guided thousands of visitors through Sri Lanka's UNESCO World Heritage Sites and has been recognized by the Sri Lanka Tourism Development Authority for excellence in cultural tourism.",
    certifications: [
      "Government Licensed Tourist Guide (Grade 1)",
      "Archaeological Society of Sri Lanka Member",
      "UNESCO Certified Cultural Guide",
      "First Aid & Emergency Response Certified"
    ],
    tourSpecialties: [
      "Sigiriya Rock Fortress tours",
      "Ancient city of Polonnaruwa",
      "Sacred city of Kandy",
      "Dambulla Cave Temple",
      "Anuradhapura archaeological sites"
    ],
    availability: "Available for bookings 7 days a week",
    responseTime: "Usually responds within 1 hour",
    contactInfo: {
      email: "rajitha@ceylontours.lk",
      phone: "+94 77 123 4567"
    }
  };

  const reviews = [
    {
      id: 1,
      name: "Michael Anderson",
      date: "January 2024",
      rating: 5,
      comment: "Rajitha made ancient history come alive! His knowledge of Sigiriya was incredible.",
      tour: "Cultural Triangle Explorer"
    },
    {
      id: 2,
      name: "Sarah Williams",
      date: "December 2023",
      rating: 5,
      comment: "Best guide we've ever had. Patient, knowledgeable, and passionate about Sri Lankan culture.",
      tour: "Complete Sri Lanka Experience"
    },
    {
      id: 3,
      name: "David Chen",
      date: "November 2023",
      rating: 5,
      comment: "Rajitha's insights into temple architecture were fascinating. Highly recommend!",
      tour: "Cultural Triangle Explorer"
    }
  ];

  const handleBookGuide = () => {
    // Check if there's a selected tour
    const selectedTour = localStorage.getItem('selectedTour');
    if (selectedTour) {
      const tourData = JSON.parse(selectedTour);
      navigate(`/booking?tour=${tourData.id}&name=${encodeURIComponent(tourData.name)}&duration=${tourData.duration}&pricePerDay=${tourData.pricePerDay}&guide=${guideData.id}&guideName=${encodeURIComponent(guideData.name)}&guideDailyRate=${guideData.dailyRate}`);
    } else {
      // If no tour selected, go to tours page
      alert('Please Select a tour first')
      navigate('/tours');
    }
  };

  if (loading) {
    return (
      <div className="loading-page">
        <div className="container">
          <div className="loading-spinner"></div>
          <p>Loading guide details...</p>
        </div>
      </div>
    );
  }

  // Use guideData instead of guide (or set guide state with fetched data)
  const currentGuide = guide || guideData;

  return (
    <div className="guide-detail-page">
      {/* Hero Section */}
      <section className="guide-hero">
        <div className="container">
          <div className="guide-hero-content">
            <div className="guide-hero-image">
              <img src={currentGuide.image} alt={currentGuide.name} />
            </div>
            <div className="guide-hero-info">
              <h1 className="guide-name">{currentGuide.name}</h1>
              <h2 className="guide-title">{currentGuide.title}</h2>
              <div className="guide-rating">
                <div className="stars">
                  {'★'.repeat(Math.floor(currentGuide.rating))}
                  {'☆'.repeat(5 - Math.floor(currentGuide.rating))}
                </div>
                <span className="rating-text">{currentGuide.rating} • {currentGuide.reviews} reviews</span>
              </div>
              <div className="guide-hero-details">
                <div className="detail">
                  <span className="detail-label">Experience</span>
                  <span className="detail-value">{currentGuide.experience}</span>
                </div>
                <div className="detail">
                  <span className="detail-label">Daily Rate</span>
                  <span className="detail-value">${currentGuide.dailyRate}/day</span>
                </div>
                <div className="detail">
                  <span className="detail-label">Response Time</span>
                  <span className="detail-value">{currentGuide.responseTime}</span>
                </div>
              </div>
              <button onClick={handleBookGuide} className="btn-primary book-guide-btn">
                Book This Guide
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="guide-detail-content">
          {/* Left Column - Guide Info */}
          <div className="guide-info-section">
            {/* About Guide */}
            <div className="info-card">
              <h3 className="info-title">About Me</h3>
              <p className="guide-bio">{currentGuide.bio}</p>
              <p className="guide-description">{currentGuide.description}</p>
            </div>

            {/* Specialties */}
            <div className="info-card">
              <h3 className="info-title">Specialties</h3>
              <div className="specialties-list">
                {currentGuide.specialties.map((specialty, index) => (
                  <span key={index} className="specialty-tag">{specialty}</span>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="info-card">
              <h3 className="info-title">Languages</h3>
              <div className="languages-list">
                {currentGuide.languages.map((language, index) => (
                  <div key={index} className="language-item">
                    <span className="language-name">{language}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="info-card">
              <h3 className="info-title">Certifications</h3>
              <ul className="certifications-list">
                {currentGuide.certifications.map((cert, index) => (
                  <li key={index}>{cert}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column - Tour Info & Reviews */}
          <div className="guide-sidebar">
            {/* Tour Specialties */}
            <div className="sidebar-card">
              <h3 className="sidebar-title">Tour Specialties</h3>
              <ul className="tour-list">
                {currentGuide.tourSpecialties.map((tour, index) => (
                  <li key={index}>{tour}</li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="sidebar-card">
              <h3 className="sidebar-title">Contact Information</h3>
              <div className="contact-details">
                <div className="contact-item">
                  <span className="contact-label">Email:</span>
                  <span className="contact-value">{currentGuide.contactInfo.email}</span>
                </div>
                <div className="contact-item">
                  <span className="contact-label">Phone:</span>
                  <span className="contact-value">{currentGuide.contactInfo.phone}</span>
                </div>
                <div className="contact-item">
                  <span className="contact-label">Availability:</span>
                  <span className="contact-value">{currentGuide.availability}</span>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="sidebar-card">
              <h3 className="sidebar-title">Recent Reviews</h3>
              <div className="reviews-list">
                {reviews.map((review) => (
                  <div key={review.id} className="review-item">
                    <div className="review-header">
                      <span className="reviewer-name">{review.name}</span>
                      <span className="review-date">{review.date}</span>
                    </div>
                    <div className="review-rating">
                      {'★'.repeat(review.rating)}
                    </div>
                    <p className="review-tour">Tour: {review.tour}</p>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourGuideDetailPage;