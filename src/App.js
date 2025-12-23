// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/work/common/Header';
import Footer from './components/work/common/Footer';
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
            
            {/* 404 Page - Optional */}
            <Route path="*" element={
              <div className="not-found-page">
                <div className="container">
                  <div className="not-found-content">
                    <h1>404 - Page Not Found</h1>
                    <p>The page you're looking for doesn't exist.</p>
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