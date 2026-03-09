// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import GuideDashboard from './components/work/pages/GuideDashboard';
import GuideApplicationPage from './components/work/pages/GuideApplicationPage';
import BookingDetailPage from './components/work/pages/BookingDetailPage';
import BookingConfirmationPage from './components/work/pages/BookingConfirmationPage';
import './utils/tourImageMapping'
import './components/work/styles/GlobalStyles.css'

const AUTH_ROUTES = ['/login', '/register', '/payment', '/guide-application'];

const Layout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = AUTH_ROUTES.includes(location.pathname);

  return (
    <div className="App">
      {!isAuthPage && <Header />}
      <main id="main-content">
        {children}
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tours" element={<ToursPage />} />
          <Route path="/tour-guides" element={<TourGuidesPage />} />
          <Route path="/tour-guide/:id" element={<TourGuideDetailPage />} />
          <Route path="/tour-itinerary/:id" element={<TourItineraryPage />} />
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
          <Route path="/booking-detail/:id" element={<BookingDetailPage />} />
          <Route path="/booking-confirmation" element={<BookingConfirmationPage />} />
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
      </Layout>
    </Router>
  );
};

export default App;