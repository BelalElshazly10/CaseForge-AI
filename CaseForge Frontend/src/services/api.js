import axios from 'axios';

// Your Flask backend routes are NOT under /api.
// Backend runs by default on http://localhost:5000
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token for protected endpoints like /secure-data and /analyze
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized. Please log in again.');
    } else if (error.response?.status === 403) {
      console.error('Forbidden. You do not have permission for this action.');
    }
    return Promise.reject(error);
  }
);

export default api;
