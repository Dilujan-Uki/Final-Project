// src/pages/GuideApplicationPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GuideApplicationPage.css';

const GuideApplicationPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    experience: '',
    certifications: '',
    languages: [],
    specialties: [],
    availableFrom: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const languageOptions = [
    'English', 'Sinhala', 'Tamil', 'French', 'German', 'Japanese', 'Chinese', 'Russian', 'Italian', 'Spanish'
  ];

  const specialtyOptions = [
    'Cultural Heritage', 'Wildlife', 'Adventure', 'Beach Tours', 'Tea Plantations', 
    'Culinary Tours', 'Hiking', 'Bird Watching', 'Photography', 'History'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e, category) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [category]: checked 
        ? [...prev[category], value]
        : prev[category].filter(item => item !== value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/guide-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Application failed');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="application-success">
        <div className="container">
          <div className="success-card">
            <div className="success-icon">✅</div>
            <h2>Application Submitted!</h2>
            <p>Thank you for applying to become a tour guide with Ceylon Tours.</p>
            <p>We will review your application and contact you within 3-5 business days.</p>
            <button onClick={() => navigate('/')} className="btn-primary">
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="guide-application-page">
      <div className="container">
        <div className="application-header">
          <h1 className="page-title">Join Our Team as a Tour Guide</h1>
          <p className="page-subtitle">
            Share your knowledge and passion for Sri Lanka with travelers from around the world
          </p>
        </div>

        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        <div className="application-form-container">
          <form onSubmit={handleSubmit} className="application-form">
            {/* Personal Information */}
            <div className="form-section">
              <h3 className="section-title">Personal Information</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fullName">Full Name *</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+94 77 123 4567"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="age">Age *</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    min="18"
                    max="70"
                    placeholder="25"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Gender *</label>
                <div className="radio-group">
                  <label className="radio">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={formData.gender === 'male'}
                      onChange={handleChange}
                      required
                    />
                    Male
                  </label>
                  <label className="radio">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={formData.gender === 'female'}
                      onChange={handleChange}
                    />
                    Female
                  </label>
                  <label className="radio">
                    <input
                      type="radio"
                      name="gender"
                      value="other"
                      checked={formData.gender === 'other'}
                      onChange={handleChange}
                    />
                    Other
                  </label>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="form-section">
              <h3 className="section-title">Professional Information</h3>

              <div className="form-group">
                <label htmlFor="experience">Years of Experience *</label>
                <textarea
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                  placeholder="Describe your experience as a tour guide (years, types of tours, etc.)"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="certifications">Certifications & Licenses *</label>
                <textarea
                  id="certifications"
                  name="certifications"
                  value={formData.certifications}
                  onChange={handleChange}
                  required
                  placeholder="List your relevant certifications (e.g., Government Licensed Guide, First Aid, etc.)"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Languages Spoken *</label>
                <div className="checkbox-group">
                  {languageOptions.map(lang => (
                    <label key={lang} className="checkbox">
                      <input
                        type="checkbox"
                        value={lang}
                        checked={formData.languages.includes(lang)}
                        onChange={(e) => handleCheckboxChange(e, 'languages')}
                      />
                      {lang}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Specialties *</label>
                <div className="checkbox-group">
                  {specialtyOptions.map(spec => (
                    <label key={spec} className="checkbox">
                      <input
                        type="checkbox"
                        value={spec}
                        checked={formData.specialties.includes(spec)}
                        onChange={(e) => handleCheckboxChange(e, 'specialties')}
                      />
                      {spec}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="availableFrom">Available From</label>
                <input
                  type="date"
                  id="availableFrom"
                  name="availableFrom"
                  value={formData.availableFrom}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>

            <p className="form-note">
              By submitting this application, you agree to be contacted by our team regarding your application.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GuideApplicationPage;