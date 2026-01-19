// src/pages/ContactPage.jsx
import React, { useState } from 'react';
import './ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Call backend API
      const response = await fetch('http://localhost:5000/api/contact',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send message');
      }

      // Success
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
      
      // Log to console for debugging
      console.log('Contact form submitted successfully:', data);
    } catch (err) {
      setError(err.message || 'Failed to send message. Please try again.');
      console.error('Contact form error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Contact Us</h1>
            <p className="hero-subtitle">Get in touch for inquiries and bookings</p>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="contact-content">
          {/* Contact Form */}
          <div className="contact-form-section">
            <div className="form-header">
              <h2 className="form-title">Send Us a Message</h2>
            </div>
            
            {/* Success Message */}
            {success && (
              <div className="success-message">
                ✅ Thank you! Your message has been sent. We'll contact you soon.
              </div>
            )}
            
            {/* Error Message */}
            {error && (
              <div className="error-message">
                ❌ {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="contact-form">
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
                  disabled={loading}
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
                  disabled={loading}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="subject" className="form-label">Subject *</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="form-select"
                  required
                  disabled={loading}
                >
                  <option value="">Select a subject</option>
                  <option value="tour-inquiry">Tour Inquiry</option>
                  <option value="booking">Booking</option>
                  <option value="custom-tour">Custom Tour Request</option>
                  <option value="general">General Question</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="message" className="form-label">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="form-textarea"
                  required
                  placeholder="Tell us about your travel plans..."
                  rows="5"
                  disabled={loading}
                />
              </div>
              
              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="contact-info-section">
            <div className="info-header">
              <h2 className="info-title">Contact Information</h2>
            </div>
            
            <div className="contact-details">
              <div className="contact-method">
                <div className="method-header">
                  <span className="method-icon">📞</span>
                  <h3 className="method-title">Phone Number</h3>
                </div>
                <p className="method-detail">+94 11 234 5678</p>
              </div>
              
              <div className="contact-method">
                <div className="method-header">
                  <span className="method-icon">✉️</span>
                  <h3 className="method-title">Email</h3>
                </div>
                <p className="method-detail">info@ceylontours.lk</p>
                <p className="method-detail">booking@ceylontours.lk</p>
              </div>
              
              <div className="contact-method">
                <div className="method-header">
                  <span className="method-icon">🕐</span>
                  <h3 className="method-title">Office Hours</h3>
                </div>
                <div className="office-hours">
                  <p className="hours-detail"><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM</p>
                  <p className="hours-detail"><strong>Saturday:</strong> 9:00 AM - 2:00 PM</p>
                  <p className="hours-detail"><strong>Sunday:</strong> Closed</p>
                  <p className="hours-note">Emergency support available 24/7 for active tour participants</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
