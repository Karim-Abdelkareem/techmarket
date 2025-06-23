import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Check if token is valid and not expired
  const isTokenValid = (token) => {
    if (!token) return false;
    
    try {
      const decoded = jwtDecode(token);
      // Check if token is expired
      return decoded.exp * 1000 > Date.now();
    } catch (error) {
      console.error('Invalid token:', error);
      return false;
    }
  };

  // Parse user from token
  const getUserFromToken = (token) => {
    if (!token) return null;
    
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  // Login function
  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setToken(token);
    setCurrentUser(userData);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setCurrentUser(null);
  };

  // Check authentication status on mount and when token changes
  useEffect(() => {
    const checkAuth = () => {
      const storedToken = localStorage.getItem('token');
      
      if (storedToken && isTokenValid(storedToken)) {
        setToken(storedToken);
        setCurrentUser(getUserFromToken(storedToken));
      } else if (storedToken) {
        // Token exists but is invalid or expired
        logout();
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const value = {
    currentUser,
    token,
    login,
    logout,
    isAuthenticated: !!currentUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};