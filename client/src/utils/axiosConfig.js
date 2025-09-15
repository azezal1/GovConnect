import axios from 'axios';

// Set default base URL for all axios requests
axios.defaults.baseURL = 'http://localhost:5000';

// Add request interceptor for handling errors globally
axios.interceptors.request.use(
  config => {
    // You can modify request config here (add headers, etc.)
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor for handling errors globally
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Handle specific error cases
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response error:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request error:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axios;