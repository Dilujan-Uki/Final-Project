// src/services/api.js
const API_BASE_URL = 'http://localhost:5000/api';

// Generic API call function
const apiCall = async (endpoint, method = 'GET', data = null) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  // Add auth token if exists
  const token = localStorage.getItem('token');
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'API request failed');
    }
    
    return result;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth API calls
export const authAPI = {
  register: (userData) => apiCall('/auth/register', 'POST', userData),
  login: (credentials) => apiCall('/auth/login', 'POST', credentials),
  getProfile: () => apiCall('/auth/profile', 'GET'),
};

// Tours API calls
export const toursAPI = {
  getAll: () => apiCall('/tours', 'GET'),
  getById: (id) => apiCall(`/tours/${id}`, 'GET'),
  getByCategory: (category) => apiCall(`/tours/category/${category}`, 'GET'),
};

// Contact API calls
export const contactAPI = {
  submit: (formData) => apiCall('/contact', 'POST', formData),
};

// Health check
export const checkHealth = () => apiCall('/health', 'GET');
