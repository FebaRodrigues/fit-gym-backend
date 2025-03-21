import axios from 'axios';

const getApiUrl = () => {
  if (import.meta.env.PROD) {
    // Use the deployed backend URL in production
    return 'https://fit-htdhhb7ld-feba-rodrigues-projects.vercel.app/api';
  }
  // Use localhost in development
  return 'http://localhost:5050/api';
};

const API = axios.create({
  baseURL: getApiUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to handle authorization
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API; 