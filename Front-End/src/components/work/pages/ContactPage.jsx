// src/components/work/pages/ContactPage.jsx
import React, { useState } from 'react';
import './ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const contactInfo = [
    {
      icon: '📧',
      title: 'Email Us',
      details: ['info@srilankaguides.com', 'support@srilankaguides.com']
    },
    {
      icon: '📞',
      title: 'Call Us',
      details: ['+94 77 123 4567', '+94 11 234 5678']
    },
    {
      icon: '📍',
      title: 'Visit Us',
      details: ['123 Galle Road', 'Colombo 03', 'Sri Lanka']
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    alert('Thank you! We will contact you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Contact Us</h1>
            <p className="hero-subtitle">We're here to help with your Sri Lankan adventure</p>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="contact-content">
          {/* Contact Information */}
          <div className="contact-info">
            <div className="section-header">
              <h2 className="section-title">Get in Touch</h2>
              <p className="section-subtitle">Choose your preferred way to contact us</p>
            </div>
            
            <div className="contact-cards">
              {contactInfo.map((info, index) => (
                <div key={index} className="contact-card">
                  <div className="contact-icon">{info.icon}</div>
                  <h3 className="card-title">{info.title}</h3>
                  <div className="card-details">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="detail">{detail}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-section">
            <div className="section-header">
              <h2 className="section-title">Send a Message</h2>
              <p className="section-subtitle">We'll respond within 24 hours</p>
            </div>
            
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Your Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="form-input"
                    required
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="subject" className="form-label">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="form-input"
                  required
                  placeholder="What is this regarding?"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message" className="form-label">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="form-textarea"
                  required
                  placeholder="How can we help you?"
                  rows="6"
                />
              </div>
              
              <button type="submit" className="submit-btn">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;