import React, { useState, useEffect } from 'react';
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

  const [existingReviews, setExistingReviews] = useState([]);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    recommendationRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false); 

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

  // Fetch reviews on component mount
  useEffect(() => {
    fetchReviews();
  }, []);

  // Auto-fill user data
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setNewReview(prev => ({
          ...prev,
          name: user.name || '',
          email: user.email || ''
        }));
      } catch (err) {
      }
    }
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/reviews');
      const data = await response.json();

      if (data.status === 'success') {
        // Map API reviews to component format
        const apiReviews = data.data.map(review => ({
          id: review._id,
          name: review.user?.name || 'Anonymous',
          location: 'Verified Traveler',
          rating: review.rating,
          date: new Date(review.createdAt).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
          }),
          title: review.title,
          comment: review.comment,
          tour: review.tour,
          guide: review.guide || '',
          verified: review.isApproved || false
        }));
        
        setExistingReviews(apiReviews);
        
        // Calculate real stats
        const total = apiReviews.length;
        const avgRating = total > 0 
          ? (apiReviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1)
          : 0;
        const recommendRate = total > 0
          ? ((apiReviews.filter(r => r.rating >= 4).length / total) * 100).toFixed(0)
          : 0;
        
        setStats({
          averageRating: avgRating,
          totalReviews: total,
          recommendationRate: recommendRate
        });
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to submit a review');
      return;
    }

    setSubmitLoading(true); // Set submit loading state

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

      // Reset form but keep user data
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;
      
      setNewReview({
        name: user?.name || '',
        email: user?.email || '',
        rating: 5,
        title: '',
        comment: '',
        tour: '',
        guide: ''
      });

      // Immediately fetch updated reviews
      await fetchReviews();

    } catch (error) {
      console.error('Review submission error:', error);
      alert(error.message || 'Failed to submit review');
    } finally {
      setSubmitLoading(false); // Reset submit loading state
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
            <h1 className="hero-title1">Traveler Reviews</h1>
            <p className="hero-subtitle1">
              Share your experience and read what others say about Island Quest and our guides
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
                Help other travelers by sharing your Island Quest experience
              </p>
            </div>

            <form onSubmit={handleSubmit} className="review-form">
              {/* Form fields (same as before) */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newReview.name}
                    onChange={handleChange}
                    className="form-input"
                    required
                    placeholder="Enter your name"
                    disabled={submitLoading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={newReview.email}
                    onChange={handleChange}
                    className="form-input"
                    required
                    placeholder="Enter your email"
                    disabled={submitLoading}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="tour" className="form-label">Tour Package</label>
                  <select
                    id="tour"
                    name="tour"
                    value={newReview.tour}
                    onChange={handleChange}
                    className="form-select"
                    required
                    disabled={submitLoading}
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
                    disabled={submitLoading}
                  >
                    <option value="">Select a guide (if any)</option>
                    {guides.map((guide, index) => (
                      <option key={index} value={guide}>{guide}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Rating</label>
                <div className="rating-selector">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`rating-star ${star <= newReview.rating ? 'selected' : ''}`}
                      onClick={() => handleRatingChange(star)}
                      aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                      disabled={submitLoading}
                    >
                      ★
                    </button>
                  ))}
                  <span className="rating-text">{newReview.rating}.0 out of 5</span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="title" className="form-label">Review Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newReview.title}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="Give your review a title"
                  disabled={submitLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="comment" className="form-label">Your Review</label>
                <textarea
                  id="comment"
                  name="comment"
                  value={newReview.comment}
                  onChange={handleChange}
                  className="form-textarea"
                  required
                  placeholder="Share details of your experience with the tour and guide..."
                  rows="6"
                  disabled={submitLoading}
                />
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={submitLoading}
              >
                {submitLoading ? 'Submitting...' : 'Submit Review'}
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

            {loading ? (
              <div className="loading-reviews">
                <div className="loading-spinner"></div>
                <p>Loading reviews...</p>
              </div>
            ) : (
              <>
                <div className="reviews-stats">
                  <div className="stat">
                    <div className="stat-value">{stats.averageRating}</div>
                    <div className="stat-label">Average Rating</div>
                  </div>
                  <div className="stat">
                    <div className="stat-value">{stats.totalReviews}</div>
                    <div className="stat-label">Total Reviews</div>
                  </div>
                  <div className="stat">
                    <div className="stat-value">{stats.recommendationRate}%</div>
                    <div className="stat-label">Would Recommend</div>
                  </div>
                </div>

                <div className="reviews-list">
                  {existingReviews.length === 0 ? (
                    <div className="empty-reviews">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                      <h3>No Reviews Yet</h3>
                      <p>Be the first to share your experience!</p>
                    </div>
                  ) : (
                    existingReviews.map((review) => (
                      <div key={review.id} className="review-card">
                        <div className="review-header">
                          <div className="reviewer-info">
                            <h4 className="reviewer-name">
                              {review.name}
                              {review.verified && (
                                <span className="verified-badge">Verified Trip</span>
                              )}
                            </h4>
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
                          <span className="review-tour">{review.tour}</span>
                          {review.guide && (
                            <span className="review-guide">Guide: {review.guide}</span>
                          )}
                          <p className="review-comment">{review.comment}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;