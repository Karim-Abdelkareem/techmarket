import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout, getCart, getProducts } from '../services/api';
import { FiUser, FiShoppingCart, FiMessageCircle, FiChevronDown, FiTag, FiRefreshCw } from 'react-icons/fi';

const CATEGORIES = [
  { id: 'Mobile', name: 'Mobile Phones & Tablets', icon: '📱' },
  { id: 'Laptop', name: 'Laptops', icon: '💻' },
  { id: 'Accessories', name: 'Accessories', icon: '🔧' },
  { id: 'Wearables', name: 'Wearables', icon: '⌚' },
  { id: 'Audio', name: 'Audio', icon: '🎧' },
  { id: 'Gaming', name: 'Gaming', icon: '🎮' },
];

const Navbar = () => {
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);
  const [showCategories, setShowCategories] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [unreadChats] = useState(0); // Placeholder for unread chat count
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

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

  // Route change effect removed

  const fetchCartCount = async () => {
    try {
      const response = await getCart();
      const cart = response.data;
      const count = cart.items ? cart.items.reduce((total, item) => total + item.quantity, 0) : 0;
      setCartCount(count);
    } catch {
      setCartCount(0);
    }
  };

  const handleLogout = () => {
    logout();
    setCartCount(0);
    navigate('/login');
  };

  // Search functionality removed

  const handleCartClick = () => {
    if (user) {
      navigate('/cart');
    } else {
      navigate('/login');
    }
  };

  const handleChatClick = () => {
    navigate('/user-chats');
  };

  const handleCategoryClick = (cat) => {
    setShowCategories(false);
    navigate(`/category/${cat.id}`);
  };

  // Search result handling removed

  return (
    <nav className="bg-dark sticky top-0 z-50 shadow-lg">
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        {/* Logo & Categories */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center">
            <div className="bg-blue-600 text-white p-1 rounded mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
            </div>
            <span className="text-white font-bold text-xl">TechMarket</span>
          </Link>
          <div className="relative">
            <button
              className="flex items-center text-white px-3 py-2 rounded hover:bg-gray-800 transition-colors"
              onClick={() => setShowCategories((v) => !v)}
            >
              <span className="mr-1">Categories</span>
              <FiChevronDown />
            </button>
            {showCategories && (
              <div className="absolute left-0 mt-2 w-56 bg-gray-900 rounded-lg shadow-lg z-50 border border-gray-700">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    className="w-full flex items-center px-4 py-3 hover:bg-gray-800 text-white text-left"
                    onClick={() => handleCategoryClick(cat)}
                  >
                    <span className="mr-2 text-xl">{cat.icon}</span>
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Offers & Trade-In Links */}
          <Link
            to="/offers"
            className="ml-2 flex items-center px-4 py-2 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors shadow-sm"
            style={{ fontSize: '1rem' }}
          >
            <FiTag className="mr-2" /> Offers
          </Link>
          <Link
            to="/trade-in"
            className="ml-2 flex items-center px-4 py-2 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors shadow-sm"
            style={{ fontSize: '1rem' }}
          >
            <FiRefreshCw className="mr-2" /> Trade-In
          </Link>
        </div>
        
        {/* Search Bar */}
        <div className="flex-1 flex justify-center items-center relative">
          <input
            type="text"
            className="w-full max-w-lg px-4 py-2 rounded-full border border-gray-700 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search products or categories..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            style={{ minWidth: '250px' }}
          />
          {showDropdown && searchResults.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
              {searchResults.map((result, idx) => (
                <button
                  key={result.type + '-' + (result._id || result.id) + '-' + idx}
                  className="w-full text-left px-4 py-3 hover:bg-gray-800 text-white flex items-center"
                  onMouseDown={() => handleResultClick(result)}
                >
                  {result.type === 'category' ? (
                    <span className="mr-2 text-xl">{result.icon}</span>
                  ) : (
                    <span className="mr-2 text-blue-400">🔎</span>
                  )}
                  <span className="truncate">{result.type === 'category' ? result.name : result.name}</span>
                  {result.type === 'product' && (
                    <span className="ml-2 text-xs text-gray-400">in {result.category}</span>
                  )}
                </button>
              ))}
              {searchResults.length === 0 && (
                <div className="px-4 py-3 text-gray-400">No results found.</div>
              )}
            </div>
          )}
        </div>
        
        {/* User/Cart/Chat */}
        <div className="flex items-center space-x-4">
          {/* Chat Icon */}
          {user && (
            <button
              onClick={handleChatClick}
              className="relative text-white hover:text-blue-400 transition-colors p-2 rounded-full bg-gray-800"
              title="Chat"
            >
              <FiMessageCircle size={22} />
              {unreadChats > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadChats > 99 ? '99+' : unreadChats}
                </span>
              )}
            </button>
          )}
          
          {/* Cart Icon */}
          <button
            onClick={handleCartClick}
            className="relative text-white hover:text-blue-400 transition-colors p-2 rounded-full bg-gray-800"
            title="Cart"
          >
            <FiShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>
          
          {/* User Menu */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu((v) => !v)}
                className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors p-2 rounded-full bg-gray-800"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
                <FiChevronDown />
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-lg z-50 border border-gray-700">
                  <Link
                    to="/user-account"
                    className="block px-4 py-3 hover:bg-gray-800 text-white"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <FiUser className="inline mr-2" /> My Account
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 hover:bg-gray-800 text-white"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="text-gray-300 hover:text-white transition-colors text-sm font-medium px-3 py-2"
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

  useEffect(() => {
    if (searchTerm.trim().length === 0) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    const delayDebounce = setTimeout(async () => {
      try {
        const products = await getProducts({ search: searchTerm });
        // Filter categories locally
        const filteredCategories = CATEGORIES.filter(cat =>
          cat.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults([
          ...filteredCategories.map(cat => ({ type: 'category', ...cat })),
          ...products.data.map(product => ({ type: 'product', ...product }))
        ]);
        setShowDropdown(true);
      } catch {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 350);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);
  const handleResultClick = (result) => {
    setShowDropdown(false);
    setSearchTerm('');
    if (result.type === 'category') {
      navigate(`/category/${result.id}`);
    } else if (result.type === 'product') {
      navigate(`/product/${result._id}`);
    }
  };
};

export default Navbar;