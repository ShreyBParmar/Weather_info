import axios from 'axios';
import { getSessionId } from '../utils/session';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach guest session ID header
api.interceptors.request.use((config) => {
  config.headers['X-Session-ID'] = getSessionId();
  return config;
});

// Centralized error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected error occurred. Please try again.';
    if (error.response?.data?.detail) {
      message = error.response.data.detail;
    } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      message = 'Request timed out. Please check your network connection.';
    } else if (error.message === 'Network Error') {
      message = 'Unable to connect to the weather service backend. Please ensure the backend server is running.';
    }
    return Promise.reject(new Error(message));
  }
);

export default api;
