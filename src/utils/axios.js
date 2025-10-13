import axios from 'axios'

const api = axios.create({
  // baseURL: import.meta.env.VITE_API_BASE || 'https://backend.mytestbuddies.shop/api',
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5000/api',
})

// Log base URL
console.log('API Base URL:', api.defaults.baseURL);

api.interceptors.request.use((config) => {
  const t = localStorage.getItem('token')
  
  // Log token before attaching it to the request
  if (t) {
    console.log('Token found in localStorage:', t); // Log the token
    config.headers.Authorization = 'Bearer ' + t;
  } else {
    console.log('No token found in localStorage');
  }
  
  // Log the full request configuration
  console.log('Request config:', config);
  
  return config;
}, (error) => {
  console.error('Request error:', error); // Log if request fails
  return Promise.reject(error);
});

export default api;
