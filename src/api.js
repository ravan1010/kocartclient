import axios from "axios";

const api = axios.create({
  baseURL: 'https://kocart-cws7.onrender.com',
  // baseURL: 'http://localhost:5001',
  withCredentials: true,
});

export default api;
