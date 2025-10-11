import axios from "axios";

// Create an axios instance with default settings
const api = axios.create({
  baseURL: "https://smc-backend-wiqx.onrender.com", // your backend base URL
  withCredentials: true, // if you use cookies for auth
});

// Optional: add interceptors to attach JWT automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.authenticate = `${token}`;
  }
  return config;
});

export default api;
