// lib/axiosClient.ts
import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080",
});

// Request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    
    console.log("🔍 [axiosClient] Request:", {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: (config.baseURL || "") + (config.url || ""),
      hasToken: !!token,
      tokenPreview: token ? token.substring(0, 50) + "..." : "No token",
      headers: config.headers
    });
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("✅ [axiosClient] Authorization header set");
    } else {
      console.log("⚠️ [axiosClient] No token found in localStorage");
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
    console.log("✅ [axiosClient] Response success:", {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
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
