// src/components/common/Header.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/tours', label: 'Tours' },
    { path: '/tour-guides', label: 'Tour Guides' },
    { path: '/contact', label: 'Contact' },
    { path: '/login', label: 'Login' },
  ];

  return (
    <>
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      
      <header className="header">
        <div className="container">
          <div className="header-content">
            {/* Logo */}
            <Link to="/" className="logo">
              <div className="logo-text">
                <h1 className="logo-title">Ceylon Tours</h1>
                <p className="logo-subtitle">Experience the pearl of the Indian Ocean</p>
              </div>
            </Link>
            
            {/* Navigation */}
            <nav className="main-nav">
              <ul className="nav-list">
                {navItems.map((item) => (
                  <li key={item.path} className="nav-item">
                    <Link 
                      to={item.path} 
                      className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
