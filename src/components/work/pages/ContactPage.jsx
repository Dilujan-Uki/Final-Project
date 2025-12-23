// src/components/work/pages/ContactPage.jsx
import React, { useState } from 'react';
import './ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    inquiryType: 'general'
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
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
    
    // Reset form after 5 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        inquiryType: 'general'
      });
    }, 5000);
  };

  const contactInfo = [
    {
      icon: '📍',
      title: 'Our Office',
      details: ['123 Galle Road', 'Colombo 03', 'Sri Lanka']
    },
    {
      icon: '📞',
      title: 'Phone Numbers',
      details: ['+94 77 123 4567', '+94 11 234 5678']
    },
    {
      icon: '✉️',
      title: 'Email Address',
      details: ['info@srilankaguides.com', 'support@srilankaguides.com']
    },
    {
      icon: '🕒',
      title: 'Working Hours',
      details: ['Monday - Friday: 9am - 6pm', 'Saturday: 9am - 1pm', 'Sunday: Closed']
    }
  ];

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Get in Touch</h1>
            <p className="hero-subtitle">We're here to help you plan your perfect Sri Lankan adventure</p>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="contact-content">
          {/* Contact Information */}
          <div className="contact-info-section">
            <div className="section-header">
              <h2 className="section-title">Contact Information</h2>
              <p className="section-subtitle">Reach out to us through any channel</p>
            </div>
            
            <div className="contact-cards">
              {contactInfo.map((info, index) => (
                <div key={index} className="contact-card">
                  <div className="contact-icon">{info.icon}</div>
                  <h3 className="contact-card-title">{info.title}</h3>
                  <div className="contact-details">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="contact-detail">{detail}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="emergency-contact">
              <div className="emergency-icon">🚨</div>
              <div className="emergency-content">
                <h3>Emergency Contact</h3>
                <p>For urgent assistance during tours: <strong>+94 77 999 8888</strong></p>
                <p className="emergency-note">Available 24/7 for registered travelers</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-section">
            <div className="section-header">
              <h2 className="section-title">Send us a Message</h2>
              <p className="section-subtitle">We typically respond within 2-4 hours</p>
            </div>
            
            {submitted ? (
              <div className="success-message">
                <div className="success-icon">✓</div>
                <h3>Message Sent Successfully!</h3>
                <p>Thank you for contacting us. We'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
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
                      placeholder="John Smith"
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
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="inquiryType" className="form-label">Inquiry Type *</label>
                  <select
                    id="inquiryType"
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="general">General Inquiry</option>
                    <option value="booking">Booking Assistance</option>
                    <option value="guide">Become a Guide</option>
                    <option value="partner">Partnership</option>
                    <option value="feedback">Feedback</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject" className="form-label">Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="form-input"
                    required
                    placeholder="How can we help you?"
                  />
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
                    placeholder="Please provide details about your inquiry..."
                    rows="6"
                  />
                </div>
                
                <button type="submit" className="submit-btn">
                  Send Message
                </button>
                
                <p className="form-note">
                  By submitting this form, you agree to our Privacy Policy. 
                  We'll never share your information with third parties.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Map Section */}
        <div className="map-section">
          <h2 className="section-title">Find Our Office</h2>
          <div className="map-container">
            <div className="map-placeholder">
              <div className="map-marker">📍</div>
              <p>Colombo, Sri Lanka</p>
              <p className="map-coordinates">6.9271° N, 79.8612° E</p>
            </div>
          </div>
          <div className="map-legend">
            <div className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: 'var(--sri-green)' }}></span>
              <span>Our Office Location</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: 'var(--sri-yellow)' }}></span>
              <span>Popular Tourist Areas</span>
            </div>
          </div>
        </div>

        {/* FAQ Quick Links */}
        <div className="faq-quicklinks">
          <h3 className="faq-title">Quick Answers</h3>
          <div className="faq-links">
            <a href="#" className="faq-link">How to book a guide?</a>
            <a href="#" className="faq-link">Payment methods accepted</a>
            <a href="#" className="faq-link">Cancellation policy</a>
            <a href="#" className="faq-link">Guide verification process</a>
            <a href="#" className="faq-link">Safety guidelines</a>
            <a href="#" className="faq-link">COVID-19 measures</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;