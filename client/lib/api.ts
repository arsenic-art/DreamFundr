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

api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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
    
    if (error.response?.status === 429 && !originalRequest._retry) {
      originalRequest._retry = true;
      const retryAfter = error.response.headers['retry-after'] || 2;
      const delay = Math.min(retryAfter * 1000, 10000);
      console.warn(`Rate limited. Retrying after ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return api.request(originalRequest);
    }

    if (error.response) {
      const serverMessage = error.response.data?.message || 
                           error.response.data?.error || 
                           error.response.data ||
                           `Server error (${error.response.status})`;
      
      const serverError = new Error(serverMessage) as any;
      serverError.response = error.response;  
      serverError.status = error.response.status;
      
      if (error.response.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          if (window.location.pathname !== '/login') {
            console.warn('Authentication expired, redirecting to login...');
            window.location.href = '/login';
          }
        }
      }
      
      return Promise.reject(serverError);
    }
    if (error.code === 'ECONNABORTED') {
      error.message = "Request timed out. Please check your connection.";
    } else if (error.code === 'ERR_NETWORK') {
      error.message = "Network error. Please check your internet connection.";
    }

    return Promise.reject(error);
  }
);

export default api;
