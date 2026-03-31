import axios from 'axios';

export const API_BASE = "http://localhost:5000/api";
export const SERVER_BASE = "http://localhost:5000";

// Converts a relative image path like /uploads/foo.jpg → full backend URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('/')) return `${SERVER_BASE}${imagePath}`;
  return imagePath;
};

export const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const savedUser = localStorage.getItem('smartMealUser');
  if (savedUser) {
    try {
      const user = JSON.parse(savedUser);
      if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    } catch (e) {
      console.error(e);
    }
  }
  return config;
});

export default api;
