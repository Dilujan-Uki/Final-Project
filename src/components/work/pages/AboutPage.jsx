// src/components/work/pages/AboutPage.jsx
import React from 'react';
import './AboutPage.css';

const AboutPage = () => {
  const steps = [
    {
      number: 1,
      title: "Search & Discover",
      description: "Browse our verified local guides by location, specialty, language, and reviews. Use our interactive map to explore Sri Lanka's top destinations.",
      icon: "🔍"
    },
    {
      number: 2,
      title: "Select Your Guide",
      description: "View detailed profiles with photos, ratings, specialties, and pricing. Chat directly with guides to discuss your needs.",
      icon: "👨‍💼"
    },
    {
      number: 3,
      title: "Customize Your Tour",
      description: "Choose dates, duration, and special requests. Create a personalized itinerary with your selected guide.",
      icon: "📅"
    },
    {
      number: 4,
      title: "Secure Booking",
      description: "Book with confidence using our secure payment system. Get instant confirmation and 24/7 support.",
      icon: "🔒"
    },
    {
      number: 5,
      title: "Experience Sri Lanka",
      description: "Meet your guide and enjoy authentic experiences. Get local insights and create unforgettable memories.",
      icon: "🌟"
    },
    {
      number: 6,
      title: "Share Your Experience",
      description: "Leave reviews to help other travelers. Share photos and stories from your journey.",
      icon: "📱"
    }
  ];

  const benefits = [
    {
      title: "Verified Local Guides",
      description: "All guides undergo background checks and verification process",
      icon: "✅"
    },
    {
      title: "Best Price Guarantee",
      description: "Get the best rates with our price match guarantee",
      icon: "💰"
    },
    {
      title: "24/7 Support",
      description: "Round-the-clock assistance in multiple languages",
      icon: "📞"
    },
    {
      title: "Flexible Cancellation",
      description: "Free cancellation up to 24 hours before your tour",
      icon: "🔄"
    },
    {
      title: "Local Expertise",
      description: "Access hidden gems and authentic experiences",
      icon: "🗺️"
    },
    {
      title: "Secure Payments",
      description: "Safe and secure payment processing",
      icon: "🔐"
    }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">How It Works</h1>
            <p className="hero-subtitle">Connecting International Tourists with Authentic Sri Lankan Guides</p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">3</span>
                <span className="stat-label">Simple Steps</span>
              </div>
              <div className="stat">
                <span className="stat-number">200+</span>
                <span className="stat-label">Verified Guides</span>
              </div>
              <div className="stat">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="steps-section section-padding">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Book Your Perfect Guide in 6 Easy Steps</h2>
            <p className="section-subtitle">From discovery to unforgettable memories</p>
          </div>
          
          <div className="steps-timeline">
            {steps.map((step, index) => (
              <div key={step.number} className="step-item">
                <div className="step-marker">
                  <span className="step-number">{step.number}</span>
                  <span className="step-icon">{step.icon}</span>
                </div>
                <div className="step-content">
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                </div>
                {index < steps.length - 1 && <div className="step-connector"></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section section-padding bg-light">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose Sri Lanka Guides</h2>
            <p className="section-subtitle">Experience the difference with our platform</p>
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

      {/* Testimonials Section */}
      <section className="testimonials-section section-padding">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What Travelers Say</h2>
            <p className="section-subtitle">Real experiences from our international guests</p>
          </div>
          
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"Our guide Kamal showed us parts of Colombo we would never have found on our own. The food tour was incredible!"</p>
              </div>
              <div className="testimonial-author">
                <div className="author-info">
                  <h4>Sarah Johnson</h4>
                  <p>From United Kingdom</p>
                </div>
                <div className="author-rating">⭐ 5.0</div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"Priya's knowledge of Sri Lankan history and culture was exceptional. She made our trip to Kandy unforgettable."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-info">
                  <h4>Michael Chen</h4>
                  <p>From Singapore</p>
                </div>
                <div className="author-rating">⭐ 4.8</div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"The booking process was smooth, and our guide Ravi was amazing. He even helped us with local SIM cards!"</p>
              </div>
              <div className="testimonial-author">
                <div className="author-info">
                  <h4>Emma Rodriguez</h4>
                  <p>From Spain</p>
                </div>
                <div className="author-rating">⭐ 4.9</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section section-padding bg-light">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">Find answers to common questions</p>
          </div>
          
          <div className="faq-grid">
            <div className="faq-item">
              <h3 className="faq-question">How are guides verified?</h3>
              <p className="faq-answer">All guides undergo background checks, language proficiency tests, and interview process. We verify their experience and local knowledge.</p>
            </div>
            
            <div className="faq-item">
              <h3 className="faq-question">What languages do guides speak?</h3>
              <p className="faq-answer">Our guides speak multiple languages including English, Sinhala, Tamil, and often other international languages like French, German, Chinese, and more.</p>
            </div>
            
            <div className="faq-item">
              <h3 className="faq-question">How does payment work?</h3>
              <p className="faq-answer">We use secure payment processing. You can pay via credit card, PayPal, or bank transfer. Payment is released to guides after successful tour completion.</p>
            </div>
            
            <div className="faq-item">
              <h3 className="faq-question">Can I customize my tour?</h3>
              <p className="faq-answer">Yes! You can customize your itinerary, duration, and activities. Discuss your preferences directly with your guide before booking.</p>
            </div>
            
            <div className="faq-item">
              <h3 className="faq-question">What if I need to cancel?</h3>
              <p className="faq-answer">Free cancellation up to 24 hours before the tour. Cancellations within 24 hours may have partial charges depending on the guide's policy.</p>
            </div>
            
            <div className="faq-item">
              <h3 className="faq-question">Is transportation included?</h3>
              <p className="faq-answer">Transportation arrangements vary by guide and package. Some include transport, others can arrange it separately. Details are listed on each guide's profile.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Experience Authentic Sri Lanka?</h2>
            <p className="cta-description">Join thousands of satisfied travelers who have discovered Sri Lanka with local experts.</p>
            <div className="cta-buttons">
              <button className="btn-primary" onClick={() => window.location.href = '/guides'}>
                Find Your Guide
              </button>
              <button className="btn-secondary" onClick={() => window.location.href = '/contact'}>
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;