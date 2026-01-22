import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/work/common/Header';
import Footer from './components/work/common/Footer';
import HomePage from './components/work/pages/HomePage';
import ToursPage from './components/work/pages/ToursPage';
import TourGuidesPage from './components/work/pages/TourGuidesPage';
import ContactPage from './components/work/pages/ContactPage';
import LoginPage from './components/work/pages/LoginPage';
import RegisterPage from './components/work/pages/RegisterPage';
import AccountPage from './components/work/pages/AccountPage'; // Add this import
import PaymentPage from './components/work/pages/PaymentPage';
import ReviewsPage from './components/work/pages/ReviewsPage';
// Remove or comment out this line temporarily:
import GlobalStyles from './components/work/styles/GlobalStyles.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Header />
        <main id="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tours" element={<ToursPage />} />
            <Route path="/tour-guides" element={<TourGuidesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/account" element={<AccountPage />} /> {/* Add this route */}
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            {/* 404 Page */}
            <Route path="*" element={
              <div className="not-found">
                <div className="container">
                  <h1>404 - Page Not Found</h1>
                  <a href="/" className="btn-primary">Go Home</a>
                </div>
              </div>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;