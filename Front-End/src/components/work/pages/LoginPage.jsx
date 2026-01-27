import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AuthPages.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Call backend API
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      console.log('Login response data:', data); // Debug log
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Login successful - save token and user data
      if (data.data) {
        // Handle different response structures
        let userData, token;
        
        if (data.data.user && data.data.token) {
          // Structure: { data: { user: {...}, token: '...' } }
          userData = data.data.user;
          token = data.data.token;
        } else if (data.data._id && data.data.token) {
          // Structure: { data: { _id: ..., name: ..., token: '...' } }
          userData = data.data;
          token = data.data.token;
          // Remove token from userData if it's mixed in
          delete userData.token;
        } else {
          // Unexpected structure
          throw new Error('Invalid response format from server');
        }

        console.log('Storing user data:', userData); // Debug log
        console.log('User role:', userData.role); // Debug log
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Redirect based on role
        if (userData.role === 'admin') {
          navigate('/admin');
          alert('Login successful! Welcome Administrator.');
        } else {
          navigate('/');
          alert('Login successful! Welcome back to Ceylon Tours.');
        }
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
      console.error('Login error:', err);
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
              <h1 className="brand-title">Welcome to Ceylon Tours</h1>
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

          {/* Right Side - Login Form */}
          <div className="auth-form-section">
            <div className="form-header">
              <h2 className="form-title">Welcome Back</h2>
              <p className="form-subtitle">Login to manage your bookings and preferences</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="error-message">
                ❌ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
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
                  placeholder="john@example.com"
                  disabled={loading}
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
                  disabled={loading}
                />
              </div>

              <div className="form-options">
                <label className="checkbox">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" className="forgot-link">
                  Forget password?
                </Link>
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Sign In'}
              </button>

              <div className="auth-footer">
                <p>
                  Don't have an account?{' '}
                  <Link to="/register" className="auth-link">
                    Sign up
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

export default LoginPage;
