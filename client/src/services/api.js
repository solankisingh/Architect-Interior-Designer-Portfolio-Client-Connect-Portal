import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('archi_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to catch unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired, clear it
      // Don't auto-redirect on check-auth requests
      if (!error.config.url.includes('/auth/me')) {
        localStorage.removeItem('archi_token');
        localStorage.removeItem('archi_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
