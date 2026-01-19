

// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Header from './components/work/common/Header';  // Corrected path
// import Footer from './components/work/common/Footer';  // Corrected path
// import HomePage from './components/work/pages/HomePage';
// import GuidesPage from './components/work/pages/GuidesPage';
// import GuideDetail from './components/work/pages/GuideDetail';
// import DestinationsPage from './components/work/pages/DestinationsPage';
// import AboutPage from './components/work/pages/AboutPage';
// import ContactPage from './components/work/pages/ContactPage';
// import './App.css';

// function App() {
//   return (
//     <Router>
//       <div className="App sri-pattern">
//         <Header />
//         <main>
//           <Routes>
//             <Route path="/" element={<HomePage />} />
//             <Route path="/guides" element={<GuidesPage />} />
//             <Route path="/guide/:id" element={<GuideDetail />} />
//             <Route path="/destinations" element={<DestinationsPage />} />
//             <Route path="/about" element={<AboutPage />} />
//             <Route path="/contact" element={<ContactPage />} />
            
//             {/* 404 Page */}
//             <Route path="*" element={
//               <div className="not-found-page section-padding">
//                 <div className="container">
//                   <div className="not-found-content text-center">
//                     <h1 className="text-sri-green" style={{ fontSize: '3rem', marginBottom: '20px' }}>404 - Page Not Found</h1>
//                     <p style={{ fontSize: '1.2rem', marginBottom: '30px', color: 'var(--text-light)' }}>
//                       The page you're looking for doesn't exist.
//                     </p>
//                     <button 
//                       className="btn-sri-green"
//                       onClick={() => window.location.href = '/'}
//                     >
//                       Go Back Home
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             } />
//           </Routes>
//         </main>
//         <Footer />
//       </div>
//     </Router>
//   );
// }

// export default App;

// src/App.jsx
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Header from './components/work/common/Header';
// import Footer from './components/work/common/Footer';
// import HomePage from './components/work/pages/HomePage';
// import GuidesPage from './components/work/pages/GuidesPage';
// import DestinationsPage from './components/work/pages/DestinationsPage';
// import AboutPage from './components/work/pages/AboutPage';
// import ContactPage from './components/work/pages/ContactPage';
// import GuideDetail from './components/work/pages/GuideDetail';
// import LoginPage from './components/work/pages/LoginPage';
// import './components/work/styles/GlobalStyles.css';

// const App = () => {
//   return (
//     <Router>
//       <div className="App">
//         <Header />
//         <main id="main-content">
//           <Routes>
//             <Route path="/" element={<HomePage />} />
//             <Route path="/guides" element={<GuidesPage />} />
//             <Route path="/destinations" element={<DestinationsPage />} />
//             <Route path="/about" element={<AboutPage />} />
//             <Route path="/contact" element={<ContactPage />} />
//             <Route path="/guide/:id" element={<GuideDetail />} />
//             <Route path="/login" element={<LoginPage />} />
//             {/* Add more routes as needed */}
//           </Routes>
//         </main>
//         <Footer />
//       </div>
//     </Router>
//   );
// };

// export default App;


// src/App.jsx

// src/App.jsx
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
