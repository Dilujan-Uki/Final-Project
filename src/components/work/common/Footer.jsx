// src/components/work/common/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Company Info */}
          <div className="footer-section">
            <div className="footer-logo">
              <div className="logo-icon">🇱🇰</div>
              <div>
                <h3 className="logo-title">Sri Lanka Guides</h3>
                <p className="logo-subtitle">Local Experts, Authentic Experiences</p>
              </div>
            </div>
            <p className="footer-description">
              Connecting international tourists with verified local guides across Sri Lanka.
              Experience authentic culture, food, and hidden gems.
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/guides">Find Guides</Link></li>
              <li><Link to="/destinations">Destinations</Link></li>
              <li><Link to="/about">How It Works</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div className="footer-section">
            <h4 className="footer-title">Contact Us</h4>
            <div className="contact-info">
              <p className="contact-item">
                <span className="icon">📍</span>
                Colombo, Sri Lanka
              </p>
              <p className="contact-item">
                <span className="icon">📞</span>
                +94 77 123 4567
              </p>
              <p className="contact-item">
                <span className="icon">📧</span>
                info@srilankaguides.com
              </p>
            </div>
          </div>
        </div>
        
        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p className="copyright">
            © {currentYear} Sri Lanka Guides. All rights reserved.
          </p>
          <div className="footer-links-bottom">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms & Conditions</Link>
            <Link to="/safety">Safety Guidelines</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;