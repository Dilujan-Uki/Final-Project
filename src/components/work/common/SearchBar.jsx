// src/components/work/common/SearchBar.jsx
import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const popularSearches = [
    'Colombo Food Tour',
    'Sigiriya Guide',
    'Kandy Cultural Tour',
    'Galle Fort Walk',
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
    <div className="search-bar">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for guides, destinations, or activities..."
            className="search-input"
            aria-label="Search for guides"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </div>
      </form>

      {/* Popular Searches */}
      <div className="popular-searches">
        <span className="popular-label">Popular searches:</span>
        <div className="search-tags">
          {popularSearches.map((search, index) => (
            <button
              key={index}
              className="search-tag"
              onClick={() => {
                setSearchTerm(search);
                onSearch(search);
              }}
              aria-label={`Search for ${search}`}
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