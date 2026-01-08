// src/components/work/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement login/signup logic here
    console.log(isLogin ? 'Login' : 'Signup', formData);
    navigate('/guides');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1 className="login-title">
            {isLogin ? 'Welcome Back' : 'Join Sri Lanka Guides'}
          </h1>
          <p className="login-subtitle">
            {isLogin 
              ? 'Sign in to continue your journey' 
              : 'Create an account to book guides and manage your tours'
            }
          </p>
        </div>

        <div className="login-card">
          <div className="login-tabs">
            <button 
              className={`tab-btn ${isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(true)}
            >
              Sign In
            </button>
            <button 
              className={`tab-btn ${!isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="name" className="form-label">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  required={!isLogin}
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="Enter your password"
                minLength="6"
              />
            </div>

            {!isLogin && (
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-input"
                  required={!isLogin}
                  placeholder="Confirm your password"
                />
              </div>
            )}

            {isLogin && (
              <div className="form-options">
                <label className="checkbox">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" className="forgot-link">
                  Forgot password?
                </Link>
              </div>
            )}

            <button type="submit" className="submit-btn">
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>

            <div className="divider">
              <span>or continue with</span>
            </div>

            <div className="social-login">
              <button type="button" className="social-btn google">
                <span>G</span> Google
              </button>
              <button type="button" className="social-btn facebook">
                <span>f</span> Facebook
              </button>
            </div>

            <p className="terms">
              By continuing, you agree to our{' '}
              <Link to="/terms">Terms of Service</Link> and{' '}
              <Link to="/privacy">Privacy Policy</Link>
            </p>
          </form>
        </div>

        <div className="login-footer">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button 
              className="switch-btn"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Sign up now' : 'Sign in here'}
            </button>
          </p>
          <p className="guest-link">
            <Link to="/guides">Continue as guest →</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;