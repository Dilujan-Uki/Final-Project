import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Clear localStorage on initial page load (npm start)
// This ensures no previous user session persists
const clearStorageOnStart = () => {
  // Check if this is a fresh start (not a refresh)
  const isFreshStart = !sessionStorage.getItem('app_initialized');
  
  if (isFreshStart) {
    console.log('Fresh app start - clearing previous sessions');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('selectedTour');
    localStorage.removeItem('selectedGuide');
    sessionStorage.setItem('app_initialized', 'true');
  }
};

clearStorageOnStart();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);