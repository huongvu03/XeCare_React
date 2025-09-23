// lib/axiosClient.ts
import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080",
});

// Request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    
    // Removed excessive logging
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // Authorization header set
    } else {
      // No token found
    }
    
    return config;
  },
  (error) => {
    console.error("❌ [axiosClient] Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => {
    // Response success
    return response;
  },
  (error) => {
    // Không log gì cả - chỉ xử lý lỗi cần thiết

    if (error.response?.status === 401) {
      console.log("🔐 [axiosClient] Unauthorized - Token expired or invalid");
      // Chỉ clear token, không tự động redirect
      // Để component tự xử lý redirect
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } catch (clearError) {
        // Không log gì cả
      }
      return Promise.reject(error);
    }

    if (error.response?.status === 403) {
      console.log("🚫 [axiosClient] Access forbidden");
      return Promise.reject(error);
    }

    if (error.response?.status === 500) {
      console.log("💥 [axiosClient] Server error");
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
