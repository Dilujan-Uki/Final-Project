import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';


const clearStorageOnStart = () => {
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