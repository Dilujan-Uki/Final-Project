import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AuthPages.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check password match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Check password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Prepare data for backend
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || ''
      };

      // Call backend API
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      if (data.status === 'success' && data.data && data.data.token) {
        const userData = { ...data.data };
        delete userData.token;
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        navigate('/');
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-container">
          {/* Left Side - Brand Info */}
          <div className="auth-brand">
            <div className="brand-content">
              <h1 className="brand-title">Welcome to Island Quest</h1>
              <p className="brand-subtitle">
                Your gateway to unforgettable Sri Lankan adventures.
              </p>
              <div className="brand-image">
                <img 
                  src="https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop" 
                  alt="Sri Lanka"
                  className="brand-img"
                />
              </div>
            </div>
          </div>

          {/* Right Side - Register Form */}
          <div className="auth-form-section">
            <div className="form-header">
              <h2 className="form-title">Create Account</h2>
              <p className="form-subtitle">Sign up to start your journey with us</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="error-message">
                ❌ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form" autoComplete="off">
              <div className="form-group">
                <label htmlFor="name" className="form-label">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="John Doe"
                  disabled={loading}
                  autoComplete="off"
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg-email" className="form-label">Email Address</label>
                <input
                  type="email"
                  id="reg-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="john@example.com"
                  disabled={loading}
                  autoComplete="off"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-label">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="0771234567"
                  disabled={loading}
                  autoComplete="off"
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg-password" className="form-label">Password</label>
                <input
                  type="password"
                  id="reg-password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="Enter your password (min. 6 characters)"
                  disabled={loading}
                  autoComplete="new-password"
                  minLength="6"
                />
                <small className="password-hint">Must be at least 6 characters</small>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="Confirm your password"
                  disabled={loading}
                  autoComplete="new-password"
                />
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>

              <div className="auth-footer">
                <p>
                  Already have an account?{' '}
                  <Link to="/login" className="auth-link">
                    Sign in here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;