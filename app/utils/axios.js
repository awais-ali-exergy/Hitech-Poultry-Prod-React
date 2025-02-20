import axios from "axios";

// export const baseURL = "http://155.135.1.86:8082/";
export const baseURL = "http://18.199.188.82:8082/";

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 10000,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle different error cases
    if (error.response) {
      // Server responded with error status
      console.error("API Error:", error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error("Network Error:", error.request);
    } else {
      // Other errors
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
