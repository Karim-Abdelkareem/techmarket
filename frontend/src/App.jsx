import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import LoginPage from './pages/Auth/LoginPage'
import SignupPage from './pages/Auth/SignupPage'
import ProductDetailsPage from './pages/Products/ProductDetailsPage'
import SearchPage from './pages/Search/SearchPage'
import CartPage from './pages/Cart & Checkout/CartPage'
import ProductsPage from './pages/Products/ProductsPage'
import OffersPage from './pages/OffersPage'
import UserAccountPage from './pages/Profile/UserAccountPage'
import UserChats from './pages/Profile/userChats'
import TradeInPage from './pages/TradeIn/TradeInPage'
import CategoryPage from './pages/Category/CategoryPage'

function App() {
  useEffect(() => {
    // Function to handle scroll animations
    const handleScrollAnimation = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      
      elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add('animate-fadeIn');
        }
      });
    };

    // Add event listener for scroll
    window.addEventListener('scroll', handleScrollAnimation);
    // Run once on initial load
    handleScrollAnimation();

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScrollAnimation);
    };
  }, []);

  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return token !== null && user !== null;
  };

  const PrivateRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div className="bg-dark">
        <Toaster position="top-right" toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: 'green',
            },
          },
          error: {
            duration: 3000,
            style: {
              background: 'red',
            },
          },
        }} />
        <Navbar className="animate-slideInDown" />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route 
            path="/user-account" 
            element={
              <PrivateRoute>
                <UserAccountPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/user-chats" 
            element={
              <PrivateRoute>
                <UserChats />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/trade-in" 
            element={
              <PrivateRoute>
                <TradeInPage />
              </PrivateRoute>
            } 
          />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route 
            path="/cart" 
            element={
              <PrivateRoute>
                <CartPage />
              </PrivateRoute>
            } 
          />
          <Route path="/products/:category" element={<ProductsPage />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          />
        </Routes>
        <Footer className="animate-on-scroll" />
      </div>
    </Router>
  )
}

export default App
