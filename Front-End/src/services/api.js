// src/api.js (UPDATED - Add new-bookings endpoints)
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

  console.log(`API Call: ${method} ${url}`, data);

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    
    console.log(`API Response from ${url}:`, result);
    
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

// Admin API calls
export const adminAPI = {
  getAllBookings: () => apiCall('/bookings/all', 'GET'),
  getAllReviews: () => apiCall('/reviews/all', 'GET'),
  getAllUsers: () => apiCall('/users', 'GET'),
  updateBookingStatus: (id, status) => apiCall(`/bookings/${id}/status`, 'PATCH', { status }),
  updateReviewStatus: (id, isApproved) => apiCall(`/reviews/${id}/approve`, 'PATCH', { isApproved }),
};

// ============ NEW BOOKINGS API (Using new-bookings endpoints) ============
export const newBookingsAPI = {
  // Create a new booking (used in BookingPage)
  create: (bookingData) => apiCall('/new-bookings', 'POST', bookingData),
  
  // Get user's bookings (used in AccountPage and MyBookingsPage)
  getMyBookings: () => apiCall('/new-bookings/my-bookings', 'GET'),
  
  // Get single booking by ID
  getById: (id) => apiCall(`/new-bookings/${id}`, 'GET'),
  
  // Cancel a booking
  cancel: (id) => apiCall(`/new-bookings/${id}/cancel`, 'PATCH')
};

// ============ LEGACY BOOKINGS API (Admin only) ============
export const bookingsAPI = {
  getAll: () => apiCall('/bookings/all', 'GET'),
  updateStatus: (id, status) => apiCall(`/bookings/${id}/status`, 'PATCH', { status }),
};

// Reviews API
export const reviewsAPI = {
  create: (reviewData) => apiCall('/reviews', 'POST', reviewData),
  getMyReviews: () => apiCall('/reviews/my-reviews', 'GET'),
  getAllReviews: () => apiCall('/reviews/all', 'GET'),
  approve: (id, isApproved) => apiCall(`/reviews/${id}/approve`, 'PATCH', { isApproved }),
  delete: (id) => apiCall(`/reviews/${id}`, 'DELETE'),
};

// Health check
export const checkHealth = () => apiCall('/health', 'GET');