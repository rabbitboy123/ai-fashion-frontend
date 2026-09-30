import axios from 'axios';
import { tokenStorage } from '@/utils/tokenStorage';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const apiInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor thêm header Authorization
apiInstance.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor xử lý lỗi 401 Unauthorized
apiInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const isAuthRoute =
      window.location.pathname.includes('/login') ||
      window.location.pathname.includes('/register');

    if (error.response?.status === 401 && !isAuthRoute) {
      tokenStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiInstance;