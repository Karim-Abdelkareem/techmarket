import axios from "axios";

const API_URL = "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const signup = async (userData) => {
  try {
    const response = await api.post("/auth/register", {
      ...userData,
      role: "user" // Always set role as user for new registrations
    });
    return response.data;
  } catch (error) {
    console.error("Error during signup:", error);
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

export const fetchUsers = async()=>{
  try{
    const response= await api.post("/user");
    return response.data;

  }catch(error){
    console.error(error);
    throw error;
  }

}

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Products API - Public access for viewing products
export const getProducts = async (params) => {
  try {
    const response = await api.get("/product", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await api.get(`/product/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};

// Search products by category and product type
export const searchProducts = async (params) => {
  try {
    const response = await api.get("/product", { params });
    return response.data;
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};

// Get products by category
export const getProductsByCategory = async (category) => {
  try {
    const response = await api.get("/product", { 
      params: { category } 
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error);
    throw error;
  }
};

// Get products by product type
export const getProductsByType = async (productType) => {
  try {
    const response = await api.get("/product", { 
      params: { productType } 
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching products for type ${productType}:`, error);
    throw error;
  }
};

// Cart API
export const getCart = async () => {
  try {
    const response = await api.get("/cart");
    return response.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
};

export const addToCart = async (productId, quantity = 1) => {
  try {
    const response = await api.post("/cart", {
      product: productId,
      quantity: quantity
    });
    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};

export const removeFromCart = async (productId) => {
  try {
    const response = await api.delete("/cart", {
      data: { product: productId }
    });
    return response.data;
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw error;
  }
};

export const updateCartItemQuantity = async (productId, quantity) => {
  try {
    const response = await api.patch("/cart", {
      product: productId,
      quantity: quantity
    });
    return response.data;
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    throw error;
  }
};

export const clearCart = async () => {
  try {
    const response = await api.delete("/cart/clear");
    return response.data;
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw error;
  }
};

// Trade-in API
export const createTradeIn = async (tradeInData) => {
  try {
    const response = await api.post("/tradein", tradeInData);
    return response.data;
  } catch (error) {
    console.error("Error creating trade-in request:", error);
    throw error;
  }
};

export const getUserTradeIns = async () => {
  try {
    const response = await api.get("/tradein/my");
    return response.data;
  } catch (error) {
    console.error("Error fetching user trade-ins:", error);
    throw error;
  }
};

export const getAllTradeIns = async () => {
  try {
    const response = await api.get("/tradein");
    return response.data;
  } catch (error) {
    console.error("Error fetching all trade-ins:", error);
    throw error;
  }
};

export const getTradeInById = async (id) => {
  try {
    const response = await api.get(`/tradein/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching trade-in with id ${id}:`, error);
    throw error;
  }
};

export const updateTradeInStatus = async (tradeInId, status) => {
  try {
    const response = await api.put("/tradein/status", { tradeInId, status });
    return response.data;
  } catch (error) {
    console.error(`Error updating trade-in status for id ${tradeInId}:`, error);
    throw error;
  }
};

// Messages/Chat API
export const sendMessage = async (messageData) => {
  try {
    const response = await api.post("/messages", messageData);
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export const getAllMessages = async () => {
  try {
    const response = await api.get("/messages");
    return response.data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

export const getMessage = async (id) => {
  try {
    const response = await api.get(`/messages/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching message with id ${id}:`, error);
    throw error;
  }
};

export const updateMessage = async (id, messageData) => {
  try {
    const response = await api.patch(`/messages/${id}`, messageData);
    return response.data;
  } catch (error) {
    console.error(`Error updating message with id ${id}:`, error);
    throw error;
  }
};

export const deleteMessage = async (id) => {
  try {
    const response = await api.delete(`/messages/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting message with id ${id}:`, error);
    throw error;
  }
};

// Inquiries API
export const createInquiry = async (inquiryData) => {
  try {
    const response = await api.post("/inquiry", inquiryData);
    return response.data;
  } catch (error) {
    console.error("Error creating inquiry:", error);
    throw error;
  }
};

export const getAllInquiries = async () => {
  try {
    const response = await api.get("/inquiry");
    return response.data;
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    throw error;
  }
};

export const getInquiryById = async (id) => {
  try {
    const response = await api.get(`/inquiry/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching inquiry with id ${id}:`, error);
    throw error;
  }
};

export const deleteInquiry = async (id) => {
  try {
    const response = await api.delete(`/inquiry/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting inquiry with id ${id}:`, error);
    throw error;
  }
};

// Reservations API
export const createReservation = async (reservationData) => {
  try {
    const response = await api.post("/reservation", reservationData);
    return response.data;
  } catch (error) {
    console.error("Error creating reservation:", error);
    throw error;
  }
};

export const getUserReservations = async () => {
  try {
    const response = await api.get("/reservation/user");
    return response.data;
  } catch (error) {
    console.error("Error fetching user reservations:", error);
    throw error;
  }
};

export const getReservationsByReferralCode = async (referralCode) => {
  try {
    const response = await api.post("/reservation/referral", { referralCode });
    return response.data;
  } catch (error) {
    console.error("Error fetching reservations by referral code:", error);
    throw error;
  }
};

export const updateReservationStatus = async (id, status) => {
  try {
    const response = await api.patch(`/reservation/${id}`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating reservation status for id ${id}:`, error);
    throw error;
  }
};

// Analytics API
export const getAnalytics = async () => {
  try {
    const response = await api.get("/analytics");
    return response.data;
  } catch (error) {
    console.error("Error fetching analytics:", error);
    throw error;
  }
};

export const getProductAnalytics = async () => {
  try {
    const response = await api.get("/analytics/products");
    return response.data;
  } catch (error) {
    console.error("Error fetching product analytics:", error);
    throw error;
  }
};

export const getUserAnalytics = async () => {
  try {
    const response = await api.get("/analytics/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching user analytics:", error);
    throw error;
  }
};

export default api;
