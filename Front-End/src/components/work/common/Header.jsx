// src/components/common/Header.jsx (updated)
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // -------- scroll shrink --------
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // -------- load user --------
  useEffect(() => {
    try {
      const data = localStorage.getItem('user');
      if (data) setUser(JSON.parse(data));
    } catch {}
  }, []);

  // -------- click outside --------
  useEffect(() => {
    const close = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  // -------- nav model --------
  const navLinks = [
    { to: '/', label: 'Home', show: true },
    { to: '/tours', label: 'Tours', show: true },
    { to: '/tour-guides', label: 'Guides', show: true },
    { to: '/reviews', label: 'Reviews', show: true },
    { to: '/contact', label: 'Contact', show: true },
  ];

  const isAdmin = user?.role === 'admin';

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header-row">

        {/* -------- logo -------- */}
        <Link to="/" className="logo">
          <div className="logo-text">
            <span className="logo-title">Ceylon Tours</span>
            <span className="logo-sub">Pearl of the Indian Ocean</span>
          </div>
        </Link>

        {/* -------- nav -------- */}
        <nav className="nav">

          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-btn ${location.pathname === link.to ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}

          {/* -------- auth area -------- */}
          {!user && (
            <Link to="/login" className="nav-btn login-btn">
              Login
            </Link>
          )}

          {user && (
            <div className="user-wrap" ref={dropdownRef}>
              <button
                className="user-btn"
                onClick={() => setShowDropdown(v => !v)}
              >
                {user.name?.split(' ')[0] || 'User'}
              </button>

              {showDropdown && (
                <div className="dropdown">
                  <Link to="/account">My Account</Link>
                  {isAdmin && <Link to="/admin">Admin Dashboard</Link>}
                  <button onClick={logout}>Logout</button>
                </div>
              )}
            </div>
          )}

        </nav>
      </div>
    </header>
  );
};

export default Header;