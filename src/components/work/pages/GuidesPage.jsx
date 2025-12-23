// src/components/work/pages/GuidesPage.jsx
import React, { useState } from 'react';
import GuideCard from '../common/GuideCard';
import FilterPanel from '../common/FilterPanel';
import SearchBar from '../common/SearchBar';
import { guides } from '../assets/data/guides';
import './GuidesPage.css';

const GuidesPage = () => {
  const [filteredGuides, setFilteredGuides] = useState(guides);
  const [filters, setFilters] = useState({
    location: '',
    languages: [],
    priceRange: [0, 100],
    rating: 0,
    specialties: []
  });
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState('grid');

  const handleSearch = (searchTerm) => {
    const filtered = guides.filter(guide =>
      guide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.specialties.some(spec => 
        spec.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredGuides(filtered);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    
    let filtered = [...guides];
    
    // Apply location filter
    if (newFilters.location) {
      filtered = filtered.filter(guide => 
        guide.location.toLowerCase() === newFilters.location.toLowerCase()
      );
    }
    
    // Apply language filter
    if (newFilters.languages.length > 0) {
      filtered = filtered.filter(guide =>
        newFilters.languages.every(lang => guide.languages.includes(lang))
      );
    }
    
    // Apply price filter
    filtered = filtered.filter(guide =>
      guide.price >= newFilters.priceRange[0] && guide.price <= newFilters.priceRange[1]
    );
    
    // Apply rating filter
    if (newFilters.rating > 0) {
      filtered = filtered.filter(guide => guide.rating >= newFilters.rating);
    }
    
    // Apply specialties filter
    if (newFilters.specialties.length > 0) {
      filtered = filtered.filter(guide =>
        newFilters.specialties.every(spec => guide.specialties.includes(spec))
      );
    }
    
    setFilteredGuides(filtered);
  };

  const handleSortChange = (sortType) => {
    setSortBy(sortType);
    
    const sorted = [...filteredGuides].sort((a, b) => {
      switch(sortType) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'reviews':
          return b.reviews - a.reviews;
        default:
          return 0;
      }
    });
    
    setFilteredGuides(sorted);
  };

  const locations = [...new Set(guides.map(guide => guide.location))];
  const allLanguages = [...new Set(guides.flatMap(guide => guide.languages))];
  const allSpecialties = [...new Set(guides.flatMap(guide => guide.specialties))];

  return (
    <div className="guides-page">
      {/* Hero Section */}
      <section className="guides-hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Find Your Perfect Guide</h1>
            <p className="hero-subtitle">Connect with verified local experts across Sri Lanka</p>
            
            <SearchBar onSearch={handleSearch} />
            
            <div className="quick-filters">
              <button 
                className="quick-filter-btn"
                onClick={() => handleFilterChange({...filters, location: 'Colombo'})}
              >
                📍 Colombo
              </button>
              <button 
                className="quick-filter-btn"
                onClick={() => handleFilterChange({...filters, location: 'Kandy'})}
              >
                🏛️ Kandy
              </button>
              <button 
                className="quick-filter-btn"
                onClick={() => handleFilterChange({...filters, location: 'Galle'})}
              >
                🏖️ Galle
              </button>
              <button 
                className="quick-filter-btn"
                onClick={() => handleFilterChange({...filters, specialties: ['Food Tours']})}
              >
                🍲 Food Experts
              </button>
              <button 
                className="quick-filter-btn"
                onClick={() => handleFilterChange({...filters, specialties: ['Historical Sites']})}
              >
                🏺 History Guides
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="guides-content">
          {/* Filters Sidebar */}
          <aside className="filters-sidebar">
            <FilterPanel
              locations={locations}
              languages={allLanguages}
              specialties={allSpecialties}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
            
            <div className="stats-card">
              <h3>Guide Statistics</h3>
              <div className="stat-item">
                <span className="stat-label">Total Guides:</span>
                <span className="stat-value">{guides.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Average Rating:</span>
                <span className="stat-value">4.7/5</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Response Time:</span>
                <span className="stat-value">&lt; 2 hours</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Verified:</span>
                <span className="stat-value">100%</span>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="guides-main">
            {/* Header with controls */}
            <div className="guides-header">
              <div className="results-info">
                <h2>Available Guides</h2>
                <p className="results-count">
                  Showing {filteredGuides.length} of {guides.length} guides
                </p>
              </div>
              
              <div className="controls">
                <div className="sort-controls">
                  <span className="sort-label">Sort by:</span>
                  <select 
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="sort-select"
                  >
                    <option value="rating">Highest Rated</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="reviews">Most Reviews</option>
                  </select>
                </div>
                
                <div className="view-controls">
                  <button 
                    className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    ▦ Grid
                  </button>
                  <button 
                    className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    ☰ List
                  </button>
                </div>
              </div>
            </div>

            {/* Guides Grid/List */}
            {filteredGuides.length === 0 ? (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <h3>No guides found</h3>
                <p>Try adjusting your filters or search terms</p>
                <button 
                  className="reset-btn"
                  onClick={() => {
                    setFilteredGuides(guides);
                    setFilters({
                      location: '',
                      languages: [],
                      priceRange: [0, 100],
                      rating: 0,
                      specialties: []
                    });
                  }}
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className={`guides-container ${viewMode}`}>
                {filteredGuides.map(guide => (
                  <GuideCard 
                    key={guide.id} 
                    guide={guide} 
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {filteredGuides.length > 0 && (
              <div className="pagination">
                <button className="page-btn disabled">« Previous</button>
                <button className="page-btn active">1</button>
                <button className="page-btn">2</button>
                <button className="page-btn">3</button>
                <span className="page-dots">...</span>
                <button className="page-btn">10</button>
                <button className="page-btn">Next »</button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* CTA Section */}
      <section className="guides-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Can't find what you're looking for?</h2>
            <p>Contact us for custom tour arrangements or special requests</p>
            <button 
              className="cta-btn"
              onClick={() => window.location.href = '/contact'}
            >
              Request Custom Tour
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GuidesPage;