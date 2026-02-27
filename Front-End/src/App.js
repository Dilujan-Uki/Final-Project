// src/App.js - Add the new route
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/work/common/Header';
import Footer from './components/work/common/Footer';
import HomePage from './components/work/pages/HomePage';
import ToursPage from './components/work/pages/ToursPage';
import TourGuidesPage from './components/work/pages/TourGuidesPage';
import TourGuideDetailPage from './components/work/pages/TourGuideDetailPage';
import TourItineraryPage from './components/work/pages/TourItineraryPage';
import ContactPage from './components/work/pages/ContactPage';
import LoginPage from './components/work/pages/LoginPage';
import RegisterPage from './components/work/pages/RegisterPage';
import AccountPage from './components/work/pages/AccountPage';
import PaymentPage from './components/work/pages/PaymentPage';
import ReviewsPage from './components/work/pages/ReviewsPage';
import BookingPage from './components/work/pages/BookingPage';
import AdminDashboard from './components/work/pages/AdminDashboard';
import MyBookingsPage from './components/work/pages/myBookingsPage';
import TourDetailPage from './components/work/pages/TourDetailPage'; 
import './utils/tourImageMapping' 
import './components/work/styles/GlobalStyles.css'

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
            <Route path="/tour-guide/:id" element={<TourGuideDetailPage />} />
            <Route path="/tour-itinerary/:id" element={<TourItineraryPage />} /> {/* NEW ROUTE */}
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/my-bookings" element={<MyBookingsPage />} />
            <Route path="/tour-detail/:id" element={<TourDetailPage />} />
            <Route path="/guide-dashboard" element={<GuideDashboard />} /> 
            <Route path="/guide-application" element={<GuideApplicationPage />} /> 
            <Route path="*" element={
              <div className="not-found">
                <div className="container">
                  <h1>404 - Page Not Found</h1>
                  <button onClick={() => window.location.href = '/'} className="btn-primary">
                    Go Home
                  </button>
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