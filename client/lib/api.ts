import axios from "axios";

const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || 
           (window.location.hostname === 'localhost' 
             ? "http://localhost:5000/api" 
             : `${window.location.protocol}//${window.location.hostname}/api`);
  }
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
};

const api = axios.create({
  baseURL: getApiUrl(),
  timeout: 20000, 
  withCredentials: true, 
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request ID for debugging
    config.headers['X-Request-ID'] = Math.random().toString(36).substring(7);

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle rate limiting with exponential backoff
    if (error.response?.status === 429 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const retryAfter = error.response.headers['retry-after'] || 2;
      const delay = Math.min(retryAfter * 1000, 10000); // Max 10 seconds
      
      console.warn(`Rate limited. Retrying after ${delay}ms...`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return api.request(originalRequest);
    }

    // Handle network errors
    if (error.code === 'ECONNABORTED') {
      console.error("Request timeout");
      error.message = "Request timed out. Please check your connection.";
    } else if (error.code === 'ERR_NETWORK') {
      console.error("Network error");
      error.message = "Network error. Please check your internet connection.";
    }

    // Handle authentication errors
    if (error.response?.status === 401) {
      // Clear invalid token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        // Optionally redirect to login
        if (window.location.pathname !== '/login') {
          console.warn('Authentication expired, redirecting to login...');
          window.location.href = '/login';
        }
      }
    }

    // Log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: error.message,
        data: error.response?.data
      });
    }
    
    return Promise.reject(error);
  }
);

export default api;
