import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  //  read user from localStorage 
  const loadUser = useCallback(() => {
    try {
      const data = localStorage.getItem('user');
      if (data) setUser(JSON.parse(data));
      else setUser(null);
    } catch {
      setUser(null);
    }
  }, []);

  // re-load user on every route change 
  useEffect(() => {
    loadUser();
  }, [location.pathname, loadUser]);

  //  also listen for storage events (cross-tab + same-tab login)
  useEffect(() => {
    // custom event fired by LoginPage right after saving to localStorage
    const onLogin = () => loadUser();
    window.addEventListener('userLogin', onLogin);
    window.addEventListener('storage', onLogin);
    return () => {
      window.removeEventListener('userLogin', onLogin);
      window.removeEventListener('storage', onLogin);
    };
  }, [loadUser]);

  //  scroll shrink 
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  //  click outside closes dropdown 
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
    setUser(null);
    navigate('/');
  };

  //  nav links 
  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/tours', label: 'Tours' },
    { to: '/tour-guides', label: 'Guides' },
    { to: '/reviews', label: 'Reviews' },
    { to: '/contact', label: 'Contact' },
  ];

  const isAdmin = user?.role === 'admin';

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header-row">

        {/*  logo  */}
        <Link to="/" className="logo">
          <div className="logo-text">
            <span className="logo-title">Island Quests</span>
            <span className="logo-sub">Pearl of the Indian Ocean</span>
          </div>
        </Link>

        {/*  nav  */}
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

          {/*  not logged in  */}
          {!user && (
            <Link to="/login" className="nav-btn login-btn">
              Login
            </Link>
          )}

          {/*  logged in  */}
          {user && (
            <div className="user-wrap" ref={dropdownRef}>
              <button
                className="user-btn"
                onClick={() => setShowDropdown(v => !v)}
              >
                {user.name?.split(' ')[0] || 'User'} ▾
              </button>

              {showDropdown && (
                <div className="dropdown">
                  <Link to="/account" onClick={() => setShowDropdown(false)}>My Account</Link>
                  <Link to="/my-bookings" onClick={() => setShowDropdown(false)}>My Bookings</Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setShowDropdown(false)}>Admin Dashboard</Link>
                  )}
                  {user?.role === 'guide' && (
                    <Link to="/guide-dashboard" onClick={() => setShowDropdown(false)}>Guide Dashboard</Link>
                  )}
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