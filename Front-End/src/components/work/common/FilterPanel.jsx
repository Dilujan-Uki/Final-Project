// src/components/work/common/FilterPanel.jsx
import React, { useState } from 'react';
import './FilterPanel.css';

const FilterPanel = ({ locations, languages, specialties, filters, onFilterChange }) => {
  const [priceRange, setPriceRange] = useState(filters.priceRange);

  const handleLanguageToggle = (language) => {
    const updatedLanguages = filters.languages.includes(language)
      ? filters.languages.filter(l => l !== language)
      : [...filters.languages, language];
    
    onFilterChange({ ...filters, languages: updatedLanguages });
  };

  const handleSpecialtyToggle = (specialty) => {
    const updatedSpecialties = filters.specialties.includes(specialty)
      ? filters.specialties.filter(s => s !== specialty)
      : [...filters.specialties, specialty];
    
    onFilterChange({ ...filters, specialties: updatedSpecialties });
  };

  const handlePriceChange = (min, max) => {
    const newMin = Math.min(min, max - 10);
    const newMax = Math.max(max, min + 10);
    setPriceRange([newMin, newMax]);
    onFilterChange({ ...filters, priceRange: [newMin, newMax] });
  };

  const handleRatingChange = (rating) => {
    onFilterChange({ ...filters, rating });
  };

  const clearFilters = () => {
    setPriceRange([0, 100]);
    onFilterChange({
      location: '',
      languages: [],
      priceRange: [0, 100],
      rating: 0,
      specialties: []
    });
  };

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h3 className="filter-title">Filters</h3>
        <button 
          className="clear-btn" 
          onClick={clearFilters}
          aria-label="Clear all filters"
        >
          Clear All
        </button>
      </div>
      
      {/* Location Filter */}
      <div className="filter-section">
        <h4 className="filter-section-title">📍 Location</h4>
        <div className="location-options">
          <button 
            className={`location-option ${!filters.location ? 'active' : ''}`}
            onClick={() => onFilterChange({ ...filters, location: '' })}
            aria-label="All locations"
          >
            All Locations
          </button>
          {locations.map((location, index) => (
            <button
              key={index}
              className={`location-option ${filters.location === location ? 'active' : ''}`}
              onClick={() => onFilterChange({ ...filters, location })}
              aria-label={`Filter by ${location}`}
            >
              {location}
            </button>
          ))}
        </div>
      </div>
      
      {/* Price Range Filter */}
      <div className="filter-section">
        <h4 className="filter-section-title">💰 Price Range (per day)</h4>
        <div className="price-range">
          <div className="price-values">
            <span className="price-min">${priceRange[0]}</span>
            <span className="price-separator">-</span>
            <span className="price-max">${priceRange[1]}</span>
          </div>
          <div className="price-slider">
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={priceRange[0]}
              onChange={(e) => handlePriceChange(parseInt(e.target.value), priceRange[1])}
              className="range-slider min"
              aria-label="Minimum price"
            />
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={priceRange[1]}
              onChange={(e) => handlePriceChange(priceRange[0], parseInt(e.target.value))}
              className="range-slider max"
              aria-label="Maximum price"
            />
          </div>
          <div className="price-presets">
            <button 
              className="price-preset" 
              onClick={() => handlePriceChange(0, 30)}
              aria-label="Budget price range: $0-30"
            >
              Budget ($0-30)
            </button>
            <button 
              className="price-preset" 
              onClick={() => handlePriceChange(30, 60)}
              aria-label="Standard price range: $30-60"
            >
              Standard ($30-60)
            </button>
            <button 
              className="price-preset" 
              onClick={() => handlePriceChange(60, 100)}
              aria-label="Premium price range: $60+"
            >
              Premium ($60+)
            </button>
          </div>
        </div>
      </div>
      
      {/* Rating Filter */}
      <div className="filter-section">
        <h4 className="filter-section-title">⭐ Minimum Rating</h4>
        <div className="rating-options">
          {[4, 4.5, 5].map(rating => (
            <button
              key={rating}
              className={`rating-option ${filters.rating === rating ? 'active' : ''}`}
              onClick={() => handleRatingChange(rating)}
              aria-label={`Minimum rating: ${rating} stars`}
            >
              {rating}+ ★
            </button>
          ))}
          <button
            className={`rating-option ${filters.rating === 0 ? 'active' : ''}`}
            onClick={() => handleRatingChange(0)}
            aria-label="Any rating"
          >
            Any Rating
          </button>
        </div>
      </div>
      
      {/* Languages Filter */}
      <div className="filter-section">
        <h4 className="filter-section-title">🗣️ Languages</h4>
        <div className="language-options">
          {languages.map((language, index) => (
            <div key={index} className="language-checkbox">
              <input
                type="checkbox"
                id={`lang-${language}`}
                checked={filters.languages.includes(language)}
                onChange={() => handleLanguageToggle(language)}
                className="checkbox-input"
                aria-label={`Select ${language} language`}
              />
              <label htmlFor={`lang-${language}`} className="checkbox-label">
                {language}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Specialties Filter */}
      <div className="filter-section">
        <h4 className="filter-section-title">🎯 Specialties</h4>
        <div className="specialty-options">
          {specialties.map((specialty, index) => (
            <div key={index} className="specialty-checkbox">
              <input
                type="checkbox"
                id={`spec-${specialty}`}
                checked={filters.specialties.includes(specialty)}
                onChange={() => handleSpecialtyToggle(specialty)}
                className="checkbox-input"
                aria-label={`Select ${specialty} specialty`}
              />
              <label htmlFor={`spec-${specialty}`} className="checkbox-label">
                {specialty}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Active Filters Display */}
      {(filters.languages.length > 0 || filters.specialties.length > 0 || filters.rating > 0 || filters.location) && (
        <div className="active-filters">
          <h4 className="active-filters-title">Active Filters</h4>
          <div className="active-filter-tags">
            {filters.location && (
              <span className="active-filter-tag">
                Location: {filters.location}
                <button 
                  className="remove-filter"
                  onClick={() => onFilterChange({ ...filters, location: '' })}
                  aria-label={`Remove location filter: ${filters.location}`}
                >
                  ×
                </button>
              </span>
            )}
            {filters.rating > 0 && (
              <span className="active-filter-tag">
                Rating: {filters.rating}+ ★
                <button 
                  className="remove-filter"
                  onClick={() => handleRatingChange(0)}
                  aria-label="Remove rating filter"
                >
                  ×
                </button>
              </span>
            )}
            {filters.languages.map(lang => (
              <span key={lang} className="active-filter-tag">
                {lang}
                <button 
                  className="remove-filter"
                  onClick={() => handleLanguageToggle(lang)}
                  aria-label={`Remove language filter: ${lang}`}
                >
                  ×
                </button>
              </span>
            ))}
            {filters.specialties.map(spec => (
              <span key={spec} className="active-filter-tag">
                {spec}
                <button 
                  className="remove-filter"
                  onClick={() => handleSpecialtyToggle(spec)}
                  aria-label={`Remove specialty filter: ${spec}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;