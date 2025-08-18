// lib/axiosClient.ts
import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080",
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // hoặc sessionStorage
    console.log("Frontend - Request URL:", config.url)
    console.log("Frontend - Full URL:", config.baseURL + config.url)
    console.log("Frontend - Token:", token ? token.substring(0, 50) + "..." : "No token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosClient;
