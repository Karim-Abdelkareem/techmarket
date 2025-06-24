import axios from "axios";

// Create an axios instance with base URL
const API_URL = "http://localhost:3000/api/analytics";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Analytics service functions
export const analyticsService = {
  // Get overview data (total users, products, sales)
  getOverview: async () => {
    try {
      const response = await api.get("/overview");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch overview data" };
    }
  },

  // Get product statistics by category
  getProductStats: async () => {
    try {
      const response = await api.get("/products");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch product statistics" };
    }
  },

  // Get user statistics (signups per month)
  getUserStats: async () => {
    try {
      const response = await api.get("/users");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch user statistics" };
    }
  },

  // Get most viewed products
  getMostViewedProducts: async () => {
    try {
      const response = await api.get("/most-viewed");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch most viewed products" };
    }
  },

  // Get most bought products
  getMostBoughtProducts: async () => {
    try {
      const response = await api.get("/most-bought");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch most bought products" };
    }
  },

  // Get top exclusive products
  getTopExclusiveProducts: async () => {
    try {
      const response = await api.get("/top-exclusive");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch top exclusive products" };
    }
  },

  // Get all dashboard analytics in one call
  getDashboardAnalytics: async () => {
    try {
      const response = await api.get("/dashboard");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch dashboard analytics" };
    }
  },
};