// src/components/work/pages/AboutPage.jsx
import React from 'react';
import './AboutPage.css';

const AboutPage = () => {
  const steps = [
    {
      number: 1,
      title: "Search & Select",
      description: "Find guides by location, language, or specialty. View profiles with photos, ratings, and reviews.",
      icon: "🔍"
    },
    {
      number: 2,
      title: "Book & Customize",
      description: "Choose dates, duration, and activities. Get instant confirmation and itinerary.",
      icon: "📅"
    },
    {
      number: 3,
      title: "Meet & Explore",
      description: "Connect with your guide. Experience authentic Sri Lanka with local insights.",
      icon: "🌟"
    }
  ];

  const benefits = [
    {
      title: "Verified Local Guides",
      description: "All guides pass background checks and interviews",
      icon: "✅"
    },
    {
      title: "Secure Booking",
      description: "Safe payments with money-back guarantee",
      icon: "🔒"
    },
    {
      title: "24/7 Support",
      description: "Always available to help with any questions",
      icon: "📞"
    },
    {
      title: "Best Price",
      description: "Transparent pricing with no hidden fees",
      icon: "💰"
    }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">How It Works</h1>
            <p className="hero-subtitle">Simple steps to find your perfect guide in Sri Lanka</p>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="section steps-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">3 Simple Steps to Book</h2>
            <p className="section-subtitle">From search to unforgettable experience</p>
          </div>
          
          <div className="steps-container">
            {steps.map((step) => (
              <div key={step.number} className="step-card">
                <div className="step-icon">{step.icon}</div>
                <div className="step-number">{step.number}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section benefits-section bg-light">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose Us</h2>
            <p className="section-subtitle">We make exploring Sri Lanka easy and safe</p>
          </div>
          
          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-card">
                <div className="benefit-icon">{benefit.icon}</div>
                <h3 className="benefit-title">{benefit.title}</h3>
                <p className="benefit-description">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section faq-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">Find answers to common questions</p>
          </div>
          
          <div className="faq-list">
            <div className="faq-item">
              <h3 className="faq-question">How are guides verified?</h3>
              <p className="faq-answer">All guides undergo background checks, interviews, and training. We verify their experience, language skills, and local knowledge.</p>
            </div>
            
            <div className="faq-item">
              <h3 className="faq-question">What languages do guides speak?</h3>
              <p className="faq-answer">Most guides speak English, Sinhala, and Tamil. Many also speak other languages like French, German, Chinese, or Japanese.</p>
            </div>
            
            <div className="faq-item">
              <h3 className="faq-question">How does payment work?</h3>
              <p className="faq-answer">We use secure payment processing. You can pay by credit card or PayPal. Payment is only released to guides after your tour.</p>
            </div>
            
            <div className="faq-item">
              <h3 className="faq-question">Can I cancel my booking?</h3>
              <p className="faq-answer">Yes! Free cancellation up to 24 hours before. Cancellations within 24 hours may have small fees.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Explore Sri Lanka?</h2>
            <p>Find your perfect guide today and create amazing memories</p>
            <div className="cta-buttons">
              <a href="/guides" className="btn-primary">Find Guides</a>
              <a href="/contact" className="btn-secondary">Contact Us</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;