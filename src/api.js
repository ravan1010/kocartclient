import axios from "axios";

const api = axios.create({
  baseURL: 'http://187.124.99.172:5001',
  // baseURL: 'http://localhost:5001',
  withCredentials: true,
});

export default api;
