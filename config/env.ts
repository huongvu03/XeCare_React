export const config = {
  // API Configuration
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",

  // Data Source Configuration
  USE_MOCK_DATA: false, // Switch to real API

  // Google Maps Configuration
  GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",

  // App Configuration
  APP_NAME: "XeCare",
  APP_VERSION: "1.0.0",

  // Feature Flags
  ENABLE_MAP_VIEW: true,
  ENABLE_REAL_TIME_SEARCH: false,

  // Pagination
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 50,
};
