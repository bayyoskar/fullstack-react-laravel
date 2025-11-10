import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// 🟢 Tambahkan token di setiap request
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

// 🔴 Tangani error, tapi jangan langsung logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.warn('⚠️ Token tidak valid atau kadaluarsa.');
      } else if (error.response.status === 403) {
        console.warn('🚫 Akses ditolak. Role tidak sesuai.');
      }
    } else {
      console.error('❌ Network error:', error);
    }
    return Promise.reject(error);
  }
);

export default api;