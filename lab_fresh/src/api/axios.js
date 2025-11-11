import axios from 'axios';

// ✅ Base URL otomatis ambil dari .env (Vercel / lokal fallback)
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL?.trim() || 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// 🟢 Tambahkan token di setiap request (kalau login sudah simpan token di localStorage)
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

// 🔴 Tangani error jaringan dan status HTTP
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error('🌐 Gagal konek ke API Railway:', error.message);
      alert('Tidak dapat terhubung ke server. Pastikan API aktif.');
    } else if (error.response.status === 401) {
      console.warn('⚠️ Token tidak valid atau kadaluarsa.');
      // optional: localStorage.removeItem('token');
    } else if (error.response.status === 403) {
      console.warn('🚫 Akses ditolak (role tidak sesuai).');
    } else {
      console.error('❌ Error dari API:', error.response);
    }
    return Promise.reject(error);
  }
);

export default api;