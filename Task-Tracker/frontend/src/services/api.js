// frontend/src/services/api.js
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://week-7-devops-deployment-assignment-EnhleM36/api',
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor for auth token
api.interceptors.request.use(
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

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Handle successful responses
    if (response.data.message) {
      toast.success(response.data.message, { autoClose: 3000 });
    }
    return response;
  },
  (error) => {
    // Handle errors
    const message = error.response?.data?.message || 
                   error.message || 
                   'An unexpected error occurred';
    
    // Skip toast for these cases
    if (![401, 403, 422].includes(error.response?.status)) {
      toast.error(message);
    }

    // Auto-logout on 401 Unauthorized
    if (error.response?.status === 401) {
      const { logout } = useAuth();
      logout();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// Helper function for file uploads
export const uploadFile = async (url, file, formDataName = 'file') => {
  const formData = new FormData();
  formData.append(formDataName, file);
  
  return api.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

// Set auth token globally
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

export default api;