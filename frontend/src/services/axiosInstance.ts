import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 second timeout to prevent infinite "Authenticating" hang
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('lexisco_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for consistent error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Standardize error responses but keep full response available
    let message = error.response?.data?.detail || error.message || 'An unexpected network error occurred';
    
    if (error.code === 'ECONNABORTED' || message.includes('timeout')) {
      message = "Backend is not responding (Timeout). Check if uvicorn is running and your internet is stable.";
    }

    error.message = message; // Update error message but don't create new Error object to preserve error.response
    return Promise.reject(error);
  }
);
