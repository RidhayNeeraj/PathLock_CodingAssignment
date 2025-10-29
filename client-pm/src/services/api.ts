import axios from 'axios';

// !! CHECK YOUR BACKEND PORT !!
// This should match the port from your ProjectManager.Api
// const API_URL = 'http://localhost:5130/api';
const API_URL = 'https://pathlock-codingassignment.onrender.com/api'; 

const api = axios.create({
  baseURL: API_URL,
});

// This is an "interceptor"
// It runs before every request is sent
api.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem('authToken');
    if (token) {
      // If the token exists, add it to the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;