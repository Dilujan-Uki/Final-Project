// src/components/work/common/Header.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/guides', label: 'Find Guides', icon: '👨‍🏫' },
    { path: '/destinations', label: 'Destinations', icon: '🗺️' },
    { path: '/about', label: 'How it Works', icon: '❓' },
    { path: '/contact', label: 'Contact', icon: '📞' },
    { path: '/login', label: 'Login', icon: '🔐' },
  ];

  return (
    <>
      {/* Skip to content link for accessibility */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      
      <header className="header">
        <div className="container">
          <div className="header-content">
            {/* Logo */}
            <Link to="/" className="logo">
              <div className="logo-icon">🇱🇰</div>
              <div className="logo-text">
                <h1 className="logo-title">Sri Lanka Guides</h1>
                <p className="logo-subtitle">Local Experts, Authentic Experiences</p>
              </div>
            </Link>
            
            {/* Main Navigation */}
            <nav className="main-nav">
              <ul className="nav-list">
                {navItems.map((item) => (
                  <li key={item.path} className="nav-item">
                    <Link 
                      to={item.path} 
                      className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                    >
                      <span className="nav-icon">{item.icon}</span>
                      <span className="nav-label">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            
            {/* User Actions */}
            <div className="header-actions">
              <Link to="/become-guide" className="btn-secondary">
                Become a Guide
              </Link>
              <Link to="/guides" className="btn-primary">
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;