// src/components/work/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <div className="logo-circle">SL</div>
              <div>
                <h3>Sri Lanka Guides</h3>
                <p>Connecting tourists with authentic local experiences</p>
              </div>
            </div>
            <p className="footer-description">
              We connect international tourists with verified local tour guides 
              across Sri Lanka. Experience authentic culture, food, and hidden gems.
            </p>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/guides">Find Guides</Link></li>
              <li><Link to="/destinations">Destinations</Link></li>
              <li><Link to="/about">How It Works</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Destinations</h4>
            <ul className="footer-links">
              <li><Link to="/guides?location=Colombo">Colombo</Link></li>
              <li><Link to="/guides?location=Kandy">Kandy</Link></li>
              <li><Link to="/guides?location=Galle">Galle</Link></li>
              <li><Link to="/guides?location=Sigiriya">Sigiriya</Link></li>
              <li><Link to="/guides?location=Ella">Ella</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Contact Info</h4>
            <div className="contact-info">
              <p>📍 Colombo, Sri Lanka</p>
              <p>📞 +94 77 123 4567</p>
              <p>✉️ info@srilankaguides.com</p>
            </div>
            <div className="social-links">
              <a href="#" className="social-icon">📘</a>
              <a href="#" className="social-icon">📸</a>
              <a href="#" className="social-icon">🐦</a>
              <a href="#" className="social-icon">▶️</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Sri Lanka Guides. All rights reserved.</p>
          <div className="footer-legal">
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