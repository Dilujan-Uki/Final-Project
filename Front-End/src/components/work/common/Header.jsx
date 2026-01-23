// src/components/common/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Check if user is logged in
 useEffect(() => {
  const userData = localStorage.getItem('user');
  if (userData) {
    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }
}, []);
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setShowDropdown(false);
    navigate('/');
  };

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/tours', label: 'Tours' },
    { path: '/tour-guides', label: 'Tour Guides' },
    { path: '/reviews', label: 'Reviews' },
    { path: '/contact', label: 'Contact' },
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

                {/* User Account Dropdown or Login Link */}
                <li className="nav-item user-dropdown-container">
                  {user ? (
                    <div className="user-menu">
                      <button
                        className="user-avatar-btn"
                        onClick={() => setShowDropdown(!showDropdown)}
                        aria-expanded={showDropdown}
                        aria-label="User menu"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="account-icon">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <span className="user-name">{user.name.split(' ')[0]}</span>
                      </button>

                      {showDropdown && (
                        <div className="dropdown-menu">
                          <div className="dropdown-header">
                            <p className="dropdown-welcome">Welcome,</p>
                            <p className="dropdown-name">{user.name}</p>
                            <p className="dropdown-email">{user.email}</p>
                          </div>
                          <div className="dropdown-divider"></div>

                          {/* Add the admin dashboard link here */}
                          {user.role === 'admin' && (
                            <Link
                              to="/admin"
                              className="dropdown-item"
                              onClick={() => setShowDropdown(false)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="7" height="9"></rect>
                                <rect x="14" y="3" width="7" height="5"></rect>
                                <rect x="3" y="15" width="7" height="6"></rect>
                                <rect x="14" y="13" width="7" height="8"></rect>
                              </svg>
                              Admin Dashboard
                            </Link>
                          )}

                          <Link
                            to="/account"
                            className="dropdown-item"
                            onClick={() => setShowDropdown(false)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                              <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            My Account
                          </Link>

                          {/* Your My Bookings link is already here - keep it */}
                          <Link
                            to="/bookings"
                            className="dropdown-item"
                            onClick={() => setShowDropdown(false)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                            </svg>
                            My Bookings
                          </Link>

                          <button
                            className="dropdown-item logout-btn"
                            onClick={handleLogout}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                              <polyline points="16 17 21 12 16 7"></polyline>
                              <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                            Logout
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
                    >
                      Login
                    </Link>
                  )}
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;