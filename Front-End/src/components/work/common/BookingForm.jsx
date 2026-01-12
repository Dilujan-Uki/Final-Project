// src/components/work/common/BookingForm.jsx
import React, { useState } from 'react';
import './BookingForm.css';

const BookingForm = ({ guide, price }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    duration: '1',
    participants: '1',
    specialRequests: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Booking submitted:', { ...formData, guide: guide?.name });
    setSubmitted(true);
    
    // Reset form after 5 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        date: '',
        duration: '1',
        participants: '1',
        specialRequests: ''
      });
    }, 5000);
  };

  const calculateTotal = () => {
    const basePrice = price || 50;
    return basePrice * parseInt(formData.duration) * parseInt(formData.participants);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="booking-form">
      <h3 className="form-title">Book This Guide</h3>
      
      {submitted ? (
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h4>Booking Request Sent!</h4>
          <p>We'll contact you within 24 hours to confirm your booking.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="booking-form-content">
          <div className="form-group">
            <label htmlFor="name" className="form-label">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              required
              placeholder="Enter your full name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              required
              placeholder="Enter your email address"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phone" className="form-label">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="form-input"
              required
              placeholder="Enter your phone number"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date" className="form-label">Tour Date *</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="form-input"
                required
                min={today}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="duration" className="form-label">Duration</label>
              <select
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="form-select"
                required
              >
                {[1, 2, 3, 4, 5, 6, 7].map(day => (
                  <option key={day} value={day}>{day} day{day > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="participants" className="form-label">Number of People *</label>
            <select
              id="participants"
              name="participants"
              value={formData.participants}
              onChange={handleChange}
              className="form-select"
              required
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                <option key={num} value={num}>{num} person{num > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="specialRequests" className="form-label">Special Requests (Optional)</label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Any dietary restrictions, accessibility needs, or specific places you want to visit..."
              rows="3"
            />
          </div>
          
          {/* Price Summary */}
          <div className="price-summary">
            <h4 className="summary-title">Price Summary</h4>
            <div className="price-row">
              <span>Guide fee per day:</span>
              <span className="price">${price || 50}</span>
            </div>
            <div className="price-row">
              <span>Duration:</span>
              <span>{formData.duration} day{formData.duration > 1 ? 's' : ''}</span>
            </div>
            <div className="price-row">
              <span>Participants:</span>
              <span>{formData.participants} person{formData.participants > 1 ? 's' : ''}</span>
            </div>
            <div className="price-total">
              <span>Total Price:</span>
              <span className="total-amount">${calculateTotal()}</span>
            </div>
            <p className="price-note">* Price includes guide services only. Entrance fees and transportation may be extra.</p>
          </div>
          
          <button type="submit" className="submit-btn">
            Request Booking - ${calculateTotal()}
          </button>
          
          <p className="form-note">
            By submitting this form, you agree to our Terms & Conditions.
            We'll contact you to confirm availability and payment details.
          </p>
        </form>
      )}
    </div>
  );
};

export default BookingForm;