import axios from "axios";

// Create an axios instance with base URL
const API_URL = "https://techmarket-lovat.vercel.app/api/auth";

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

// Authentication service functions
export const authService = {
  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post("/login", { email, password });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Login failed" };
    }
  },

  // Register user
  register: async (userData) => {
    try {
      // Create FormData for file upload if profile picture is included
      if (userData.profilePicture) {
        const formData = new FormData();
        formData.append("name", userData.name);
        formData.append("email", userData.email);
        formData.append("password", userData.password);
        if (userData.role) formData.append("role", userData.role);
        formData.append("profilePicture", userData.profilePicture);

        const response = await axios.post(`${API_URL}/register`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return response.data;
      } else {
        // Regular JSON request without file
        const response = await api.post("/register", userData);
        return response.data;
      }
    } catch (error) {
      throw error.response?.data || { message: "Registration failed" };
    }
  },

  // Get current user profile
  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token");

      const response = await axios.get(
        "https://techmarket-lovat.vercel.app/api/v1/users/profile",
        {
          headers: { Authorization: token },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to get user profile" };
    }
  },
};
