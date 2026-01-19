// src/components/common/Footer.jsx
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
            <div className="footer-brand">
              <h3 className="footer-logo">Ceylon Tours</h3>
              <p className="footer-description">
                Experience the pearl of the Indian Ocean with our expert guides 
                and personalized tour packages.
              </p>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/tours">Tours</Link></li>
              <li><Link to="/tour-guides">Tour Guides</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/login">Login</Link></li>
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
                +94 11 234 5678
              </p>
              <p className="contact-item">
                <span className="icon">✉️</span>
                info@ceylontours.lk
              </p>
            </div>
          </div>
        </div>
        
        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p className="copyright">
            © {currentYear} Ceylon Tours. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
