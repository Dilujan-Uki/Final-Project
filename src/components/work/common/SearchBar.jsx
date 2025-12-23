// src/components/work/common/SearchBar.jsx
import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const popularSearches = [
    'Colombo Food Tour',
    'Sigiriya Guide',
    'Kandy Cultural Tour',
    'Galle Fort',
    'Wildlife Safari',
    'Tea Plantation Tour'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-group">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search guides, destinations, or specialties..."
            className="search-input"
          />
          <button type="submit" className="search-btn">
            Search
          </button>
          <button 
            type="button" 
            className="filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            ⚙️ Filters
          </button>
        </div>
      </form>

      {/* Quick Filters */}
      {showFilters && (
        <div className="quick-filter-panel">
          <div className="filter-section">
            <h4>Location</h4>
            <div className="filter-options">
              <button className="filter-option">📍 Colombo</button>
              <button className="filter-option">🏛️ Kandy</button>
              <button className="filter-option">🏖️ Galle</button>
              <button className="filter-option">🌳 Ella</button>
              <button className="filter-option">🏺 Anuradhapura</button>
            </div>
          </div>
          
          <div className="filter-section">
            <h4>Specialties</h4>
            <div className="filter-options">
              <button className="filter-option">🍲 Food Tours</button>
              <button className="filter-option">📸 Photography</button>
              <button className="filter-option">🏛️ History</button>
              <button className="filter-option">🌿 Nature</button>
              <button className="filter-option">👨‍👩‍👧‍👦 Family Tours</button>
            </div>
          </div>
          
          <div className="filter-section">
            <h4>Languages</h4>
            <div className="filter-options">
              <button className="filter-option">🇬🇧 English</button>
              <button className="filter-option">🇫🇷 French</button>
              <button className="filter-option">🇩🇪 German</button>
              <button className="filter-option">🇨🇳 Chinese</button>
              <button className="filter-option">🇯🇵 Japanese</button>
            </div>
          </div>
        </div>
      )}

      {/* Popular Searches */}
      <div className="popular-searches">
        <span className="popular-label">Popular:</span>
        <div className="search-tags">
          {popularSearches.map((search, index) => (
            <button
              key={index}
              className="search-tag"
              onClick={() => {
                setSearchTerm(search);
                onSearch(search);
              }}
            >
              {search}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;