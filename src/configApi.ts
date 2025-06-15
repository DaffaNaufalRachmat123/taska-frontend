import axios from "axios";
import { useAuthStore } from "./stores/auth/auth.store";

export const BASE_URL = process.env.REACT_APP_API_URL

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Accept': 'application/json'
  }
});

// Add a request interceptor to include the token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers['Authorization'] = token
    }
    if (config.data && config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    } else {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => {
    // Handle the error
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      const { logout , setSessionExpired } = useAuthStore.getState()
      logout();
      setSessionExpired()
      const loginUrl = new URL('/auth', window.location.origin);
      window.location.href = loginUrl.toString();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
