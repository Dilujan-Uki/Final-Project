// src/components/work/common/Testimonials.jsx
import React, { useState } from 'react';
import './Testimonials.css';

const Testimonials = ({ testimonials = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const defaultTestimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      location: "London, UK",
      rating: 5,
      date: "January 2024",
      comment: "Our guide Kamal was absolutely amazing! His knowledge of Colombo's history and food scene was incredible. The street food tour was the highlight of our trip!"
    },
    {
      id: 2,
      name: "Michael Chen",
      location: "Singapore",
      rating: 5,
      date: "December 2023",
      comment: "Very professional and punctual. Our guide showed us hidden gems we would never have found on our own. Highly recommended!"
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      location: "Madrid, Spain",
      rating: 5,
      date: "November 2023",
      comment: "We booked for 3 days and our guide planned the perfect itinerary. His English is excellent and he's very patient with questions."
    }
  ];

  const displayTestimonials = testimonials.length > 0 ? testimonials : defaultTestimonials;

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === displayTestimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? displayTestimonials.length - 1 : prevIndex - 1
    );
  };

  const goToTestimonial = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="testimonials">
      <div className="testimonials-header">
        <h2 className="section-title">Traveler Reviews</h2>
        <p className="section-subtitle">What our guests say about their experiences</p>
      </div>

      <div className="testimonial-slider">
        <button 
          className="slider-btn prev" 
          onClick={prevTestimonial}
          aria-label="Previous testimonial"
        >
          ←
        </button>
        
        <div className="testimonial-card">
          <div className="testimonial-rating">
            {'★'.repeat(displayTestimonials[currentIndex].rating)}
            {'☆'.repeat(5 - displayTestimonials[currentIndex].rating)}
          </div>
          
          <p className="testimonial-comment">
            "{displayTestimonials[currentIndex].comment}"
          </p>
          
          <div className="testimonial-author">
            <div className="author-info">
              <h4 className="author-name">{displayTestimonials[currentIndex].name}</h4>
              <div className="author-details">
                <span className="author-location">{displayTestimonials[currentIndex].location}</span>
                <span className="author-date">{displayTestimonials[currentIndex].date}</span>
              </div>
            </div>
          </div>
        </div>
        
        <button 
          className="slider-btn next" 
          onClick={nextTestimonial}
          aria-label="Next testimonial"
        >
          →
        </button>
      </div>

      <div className="testimonial-dots">
        {displayTestimonials.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToTestimonial(index)}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>

      <div className="testimonials-stats">
        <div className="stat">
          <div className="stat-number">4.8</div>
          <div className="stat-label">Average Rating</div>
        </div>
        <div className="stat">
          <div className="stat-number">98%</div>
          <div className="stat-label">Would Recommend</div>
        </div>
        <div className="stat">
          <div className="stat-number">500+</div>
          <div className="stat-label">Happy Travelers</div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;