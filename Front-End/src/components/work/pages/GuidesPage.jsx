// src/components/work/pages/GuidesPage.jsx
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import GuideCard from '../common/GuideCard';
import FilterPanel from '../common/FilterPanel';
import SearchBar from '../common/SearchBar';
import { guides } from '../data/guides';
import './GuidesPage.css';

const GuidesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    languages: [],
    priceRange: [0, 100],
    rating: 0,
    specialties: []
  });
  
  const [sortBy, setSortBy] = useState('rating');

  const handleSearch = (searchTerm) => {
    setSearchParams({ search: searchTerm });
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (sortType) => {
    setSortBy(sortType);
  };

  // Filter guides
  let filteredGuides = guides.filter(guide => {
    // Location filter
    if (filters.location && guide.location !== filters.location) return false;
    
    // Price filter
    if (guide.price < filters.priceRange[0] || guide.price > filters.priceRange[1]) return false;
    
    // Rating filter
    if (filters.rating > 0 && guide.rating < filters.rating) return false;
    
    // Languages filter
    if (filters.languages.length > 0 && 
        !filters.languages.every(lang => guide.languages.includes(lang))) return false;
    
    // Specialties filter
    if (filters.specialties.length > 0 && 
        !filters.specialties.every(spec => guide.specialties.includes(spec))) return false;
    
    return true;
  });

  // Sort guides
  filteredGuides.sort((a, b) => {
    switch(sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      case 'reviews': return b.reviews - a.reviews;
      default: return 0;
    }
  });

  const locations = [...new Set(guides.map(g => g.location))];
  const languages = [...new Set(guides.flatMap(g => g.languages))];
  const specialties = [...new Set(guides.flatMap(g => g.specialties))];

  return (
    <div className="guides-page">
      {/* Hero Section */}
      <section className="guides-hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Find Your Guide</h1>
            <p className="hero-subtitle">Connect with verified local experts across Sri Lanka</p>
            
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      <div className="container">
        <div className="guides-content">
          {/* Filters Sidebar */}
          <aside className="filters-sidebar">
            <FilterPanel
              locations={locations}
              languages={languages}
              specialties={specialties}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </aside>

          {/* Main Content */}
          <main className="guides-main">
            {/* Header */}
            <div className="guides-header">
              <div className="results-info">
                <h2>Available Guides</h2>
                <p className="results-count">
                  {filteredGuides.length} of {guides.length} guides found
                </p>
              </div>
              
              <div className="sort-controls">
                <label htmlFor="sort" className="sort-label">Sort by:</label>
                <select 
                  id="sort"
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
            </div>

            {/* Guides Grid */}
            {filteredGuides.length === 0 ? (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <h3>No guides found</h3>
                <p>Try adjusting your filters or search terms</p>
                <button 
                  className="reset-btn"
                  onClick={() => {
                    setFilters({
                      location: '',
                      languages: [],
                      priceRange: [0, 100],
                      rating: 0,
                      specialties: []
                    });
                    setSortBy('rating');
                  }}
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="guides-grid">
                {filteredGuides.map(guide => (
                  <GuideCard key={guide.id} guide={guide} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default GuidesPage;