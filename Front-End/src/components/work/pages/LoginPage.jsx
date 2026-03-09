import React, { useState, useEffect } from 'react';
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

  // Clear form when component mounts
  useEffect(() => {
    setFormData({ email: '', password: '' });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.data) {
        let userData, token;
        
        if (data.data.user && data.data.token) {
          userData = data.data.user;
          token = data.data.token;
        } else if (data.data._id && data.data.token) {
          userData = data.data;
          token = data.data.token;
          delete userData.token;
        } else {
          throw new Error('Invalid response format from server');
        }
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));

        // Notify Header immediately so it updates without needing a refresh
        window.dispatchEvent(new Event('userLogin'));
        
        if (userData.role === 'admin') {
          navigate('/admin');
        } else if (userData.role === 'guide') {
          navigate('/guide-dashboard');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
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
              
              <div className="brand-features">
                <div className="brand-feature">
                  <span className="brand-feature-icon">🏆</span>
                  <span>Expert Local Guides</span>
                </div>
                <div className="brand-feature">
                  <span className="brand-feature-icon">🌿</span>
                  <span>Authentic Experiences</span>
                </div>
                <div className="brand-feature">
                  <span className="brand-feature-icon">⭐</span>
                  <span>5-Star Rated Tours</span>
                </div>
              </div>

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
              <p className="form-subtitle">Sign in to continue your journey</p>
            </div>

            {error && (
              <div className="error-message">
                <span>❌</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form" autoComplete="off">
              <div className="form-group">
                <label htmlFor="login-email" className="form-label">Email Address</label>
                <input
                  type="email"
                  id="login-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="your@email.com"
                  disabled={loading}
                  autoComplete="off"
                />
              </div>

              <div className="form-group">
                <label htmlFor="login-password" className="form-label">Password</label>
                <input
                  type="password"
                  id="login-password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="••••••••"
                  disabled={loading}
                  autoComplete="off"
                />
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              <div className="auth-footer">
                <p>
                  Don't have an account?{' '}
                  <Link to="/register" className="auth-link">
                    Create account
                  </Link>
                </p>
                <p style={{ marginTop: '0.5rem' }}>
                  Want to be a guide?{' '}
                  <Link to="/guide-application" className="auth-link">
                    Apply here
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