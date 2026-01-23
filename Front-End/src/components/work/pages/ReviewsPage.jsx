// src/pages/ReviewsPage.jsx
import React, { useState,useEffect } from 'react';
import './ReviewsPage.css';

const ReviewsPage = () => {
  const [newReview, setNewReview] = useState({
    name: '',
    email: '',
    rating: 5,
    title: '',
    comment: '',
    tour: '',
    guide: ''
  });

  const existingReviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      location: "London, UK",
      rating: 5,
      date: "January 2024",
      title: "Amazing Cultural Experience",
      comment: "The Cultural Triangle tour was absolutely incredible! Our guide Rajitha was knowledgeable and made ancient history come alive. Highly recommended!",
      tour: "Cultural Triangle Explorer",
      guide: "Rajitha Fernando"
    },
    {
      id: 2,
      name: "Michael Chen",
      location: "Singapore",
      rating: 5,
      date: "December 2023",
      title: "Best Wildlife Safari",
      comment: "Saw leopards, elephants, and so many birds in Yala National Park. Our guide Sanduni was an expert tracker and made the experience unforgettable!",
      tour: "Wildlife Safari Experience",
      guide: "Sanduni Perera"
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      location: "Madrid, Spain",
      rating: 5,
      date: "November 2023",
      title: "Perfect Hill Country Adventure",
      comment: "The train journey through tea plantations was breathtaking. Our guide Kamal was excellent and made the experience magical.",
      tour: "Hill Country Adventure",
      guide: "Kamal Silva"
    },
    {
      id: 4,
      name: "David Wilson",
      location: "Sydney, Australia",
      rating: 4,
      date: "October 2023",
      title: "Great Beach Tour",
      comment: "Galle Fort was fascinating and the beaches were pristine. Our guide Chaminda was very knowledgeable about marine life.",
      tour: "Coastal Paradise Tour",
      guide: "Chaminda Wickramasinghe"
    },
    {
      id: 5,
      name: "Priya Sharma",
      location: "Mumbai, India",
      rating: 5,
      date: "September 2023",
      title: "Tea Plantation Excellence",
      comment: "As a tea lover, this tour was perfect! Priya's knowledge about Ceylon tea was incredible. The tasting sessions were amazing.",
      tour: "Tea Country Journey",
      guide: "Priya Jayawardena"
    },
    {
      id: 6,
      name: "James Anderson",
      location: "Toronto, Canada",
      rating: 5,
      date: "August 2023",
      title: "Complete Sri Lanka Experience",
      comment: "12 days covering the entire island was worth every penny. Our guide Nilantha made every day special with his culinary insights.",
      tour: "Complete Sri Lanka Experience",
      guide: "Nilantha De Silva"
    }
  ];

  const tours = [
    "Cultural Triangle Explorer",
    "Hill Country Adventure",
    "Wildlife Safari Experience",
    "Coastal Paradise Tour",
    "Tea Country Journey",
    "Complete Sri Lanka Experience"
  ];

  const guides = [
    "Rajitha Fernando",
    "Sanduni Perera",
    "Kamal Silva",
    "Nilantha De Silva",
    "Chaminda Wickramasinghe",
    "Priya Jayawardena"
  ];


  // Update the ReviewsPage.jsx handleSubmit function:

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to submit a review');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newReview)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit review');
      }

      alert('Thank you for your review! It will be published after moderation.');

      // Reset form
      setNewReview({
        name: '',
        email: '',
        rating: 5,
        title: '',
        comment: '',
        tour: '',
        guide: ''
      });

      // Refresh reviews list
      fetchReviews();

    } catch (error) {
      console.error('Review submission error:', error);
      alert(error.message || 'Failed to submit review');
    }
  };

  // Add useEffect to fetch reviews:
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/reviews');
      const data = await response.json();

      if (data.status === 'success') {
        // Transform API data to match existing format
        const apiReviews = data.data.map(review => ({
          id: review._id,
          name: review.user?.name || 'Anonymous',
          location: '', // You might want to add location to your Review model
          rating: review.rating,
          date: new Date(review.createdAt).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
          }),
          title: review.title,
          comment: review.comment,
          tour: review.tour,
          guide: review.guide || ''
        }));

        // You can either replace or merge with existing reviews
        // setExistingReviews(apiReviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewReview(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (rating) => {
    setNewReview(prev => ({
      ...prev,
      rating
    }));
  };

  return (
    <div className="reviews-page">
      {/* Hero Section */}
      <section className="reviews-hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Traveler Reviews</h1>
            <p className="hero-subtitle">
              Share your experience and read what others say about Ceylon Tours and our guides
            </p>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="reviews-content">
          {/* Write Review Form */}
          <div className="write-review-section">
            <div className="section-header">
              <h2 className="section-title">Share Your Experience</h2>
              <p className="section-subtitle">
                Help other travelers by sharing your Ceylon Tours experience
              </p>
            </div>

            <form onSubmit={handleSubmit} className="review-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Your Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newReview.name}
                    onChange={handleChange}
                    className="form-input"
                    required
                    placeholder="Enter your name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={newReview.email}
                    onChange={handleChange}
                    className="form-input"
                    required
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="tour" className="form-label">Tour Package *</label>
                  <select
                    id="tour"
                    name="tour"
                    value={newReview.tour}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select a tour</option>
                    {tours.map((tour, index) => (
                      <option key={index} value={tour}>{tour}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="guide" className="form-label">Tour Guide (Optional)</label>
                  <select
                    id="guide"
                    name="guide"
                    value={newReview.guide}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">Select a guide (if any)</option>
                    {guides.map((guide, index) => (
                      <option key={index} value={guide}>{guide}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Rating *</label>
                <div className="rating-selector">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`rating-star ${star <= newReview.rating ? 'selected' : ''}`}
                      onClick={() => handleRatingChange(star)}
                      aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="rating-text">{newReview.rating}.0 out of 5</span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="title" className="form-label">Review Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newReview.title}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="Give your review a title"
                />
              </div>

              <div className="form-group">
                <label htmlFor="comment" className="form-label">Your Review *</label>
                <textarea
                  id="comment"
                  name="comment"
                  value={newReview.comment}
                  onChange={handleChange}
                  className="form-textarea"
                  required
                  placeholder="Share details of your experience with the tour and guide..."
                  rows="6"
                />
              </div>

              <button type="submit" className="submit-btn">
                Submit Review
              </button>

              <p className="form-note">
                Your review will be published after moderation. We value authentic experiences.
              </p>
            </form>
          </div>

          {/* Existing Reviews */}
          <div className="existing-reviews-section">
            <div className="section-header">
              <h2 className="section-title">Recent Reviews</h2>
              <p className="section-subtitle">
                What our travelers are saying about our tours and guides
              </p>
            </div>

            <div className="reviews-stats">
              <div className="stat">
                <div className="stat-value">4.8</div>
                <div className="stat-label">Average Rating</div>
              </div>
              <div className="stat">
                <div className="stat-value">156</div>
                <div className="stat-label">Total Reviews</div>
              </div>
              <div className="stat">
                <div className="stat-value">98%</div>
                <div className="stat-label">Would Recommend</div>
              </div>
            </div>

            <div className="reviews-list">
              {existingReviews.map((review) => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <h4 className="reviewer-name">{review.name}</h4>
                      <div className="reviewer-details">
                        <span className="reviewer-location">{review.location}</span>
                        <span className="review-date">{review.date}</span>
                      </div>
                    </div>
                    <div className="review-rating">
                      {'★'.repeat(review.rating)}
                      {'☆'.repeat(5 - review.rating)}
                    </div>
                  </div>

                  <div className="review-content">
                    <h3 className="review-title">{review.title}</h3>
                    <p className="review-tour">Tour: {review.tour}</p>
                    {review.guide && (
                      <p className="review-guide">Guide: {review.guide}</p>
                    )}
                    <p className="review-comment">{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;