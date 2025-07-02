import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout, getCart } from '../services/api';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [cartLoading, setCartLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Safely get user from localStorage
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchCartCount();
    }
  }, [user]);

  const fetchCartCount = async () => {
    try {
      setCartLoading(true);
      const response = await getCart();
      const cart = response.data;
      const count = cart.items ? cart.items.reduce((total, item) => total + item.quantity, 0) : 0;
      setCartCount(count);
    } catch (error) {
      console.error('Error fetching cart count:', error);
      setCartCount(0);
    } finally {
      setCartLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setCartCount(0);
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?category=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleCartClick = () => {
    if (user) {
      navigate('/cart');
    } else {
      navigate('/login');
    }
  };

  return (
    <nav className="bg-dark py-4 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <div className="mr-4">
          <Link to="/" className="flex items-center">
            <div className="bg-blue-600 text-white p-1 rounded mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
            </div>
            <span className="text-white font-bold text-xl">TechMarket</span>
          </Link>
        </div>
        <div className="hidden md:flex space-x-6">
          <Link to="/products/Laptop" className="text-white hover:text-gray-300 transition-colors">Laptops</Link>
          <Link to="/products/Mobile" className="text-white hover:text-gray-300 transition-colors">Mobile Phones</Link>
          <Link to="/products/Tablet" className="text-white hover:text-gray-300 transition-colors">Tablets</Link>
          <Link to="/products/Wearable" className="text-white hover:text-gray-300 transition-colors">Wearables</Link>
          <Link to="/products/Audio" className="text-white hover:text-gray-300 transition-colors">Audio</Link>
          <Link to="/products/Accessory" className="text-white hover:text-gray-300 transition-colors">Accessories</Link>
          <Link to="/offers" className="text-red-400 hover:text-red-300 transition-colors font-semibold">Offers</Link>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search for products..."
            className="bg-gray-700 text-white px-4 py-2 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="absolute right-3 top-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>
        {user && (
          <button className="text-white" onClick={() => navigate('/user-account')}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </button>
        )}
        {user ? (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
              <span className="text-white text-sm hidden md:block">{user.name}</span>
            </div>
            <button 
              onClick={handleLogout} 
              className="text-gray-300 hover:text-white transition-colors flex items-center space-x-1"
              title="Logout"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden md:block text-sm">Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <Link 
              to="/login" 
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              Sign In
            </Link>
            <Link 
              to="/signup" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Sign Up
            </Link>
          </div>
        )}
        <div className="relative">
          <button 
            onClick={handleCartClick}
            className="text-white flex items-center hover:text-blue-400 transition-colors"
            title="Shopping Cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartCount > 0 && (
              <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-1">
                {cartLoading ? (
                  <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-white"></div>
                ) : (
                  cartCount > 99 ? '99+' : cartCount
                )}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;