// src/components/work/Header.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../common/Header.css';

const Header = () => {
  const location = useLocation();
  
  return (
    <header className="glass-nav sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-20 h-20 bg-sri-green rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-l">SL</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-sri-green">SL Guides</h1>
              <p className="text-s text-sri-teal">Connecting Tourists with Locals</p>
            </div>
          </Link>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/guides" 
              className={`nav-link ${location.pathname === '/guides' ? 'active' : ''}`}
            >
              Find Guides
            </Link>
            <Link 
              to="/destinations" 
              className={`nav-link ${location.pathname === '/destinations' ? 'active' : ''}`}
            >
              Destinations
            </Link>
            <Link 
              to="/about" 
              className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
            >
              How It Works
            </Link>
            <Link 
              to="/contact" 
              className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}
            >
              Contact
            </Link>
          </nav>
          
          {/* CTA Buttons */}
          <div className="flex items-center space-x-4">
            <button className="btn-sri-green hidden md:block">
              Become a Guide
            </button>
            <button className="btn-sri-yellow">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;