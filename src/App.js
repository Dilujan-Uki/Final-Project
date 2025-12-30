

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/work/common/Header';  // Corrected path
import Footer from './components/work/common/Footer';  // Corrected path
import HomePage from './components/work/pages/HomePage';
import GuidesPage from './components/work/pages/GuidesPage';
import GuideDetail from './components/work/pages/GuideDetail';
import DestinationsPage from './components/work/pages/DestinationsPage';
import AboutPage from './components/work/pages/AboutPage';
import ContactPage from './components/work/pages/ContactPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App sri-pattern">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/guides" element={<GuidesPage />} />
            <Route path="/guide/:id" element={<GuideDetail />} />
            <Route path="/destinations" element={<DestinationsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            
            {/* 404 Page */}
            <Route path="*" element={
              <div className="not-found-page section-padding">
                <div className="container">
                  <div className="not-found-content text-center">
                    <h1 className="text-sri-green" style={{ fontSize: '3rem', marginBottom: '20px' }}>404 - Page Not Found</h1>
                    <p style={{ fontSize: '1.2rem', marginBottom: '30px', color: 'var(--text-light)' }}>
                      The page you're looking for doesn't exist.
                    </p>
                    <button 
                      className="btn-sri-green"
                      onClick={() => window.location.href = '/'}
                    >
                      Go Back Home
                    </button>
                  </div>
                </div>
              </div>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;