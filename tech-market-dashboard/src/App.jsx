import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';

// Components
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Unauthorized from './components/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import AdminLayout from './layouts/AdminLayout';
import CategoryPage from './components/dashboard/CategoryPage';

// Analytics Components
import Analytics from './components/analytics/Analytics';
import Overview from './components/analytics/Overview';
import ProductStats from './components/analytics/ProductStats';
import UserStats from './components/analytics/UserStats';
import MostViewedProducts from './components/analytics/MostViewedProducts';
import MostBoughtProducts from './components/analytics/MostBoughtProducts';
import TopExclusiveProducts from './components/analytics/TopExclusiveProducts';

// Admin Components
import ModeratorList from './components/admin/ModeratorList';
import CompanyList from './components/admin/CompanyList';

// Create a client for React Query
const queryClient = new QueryClient();

// Component to redirect based on authentication status
const AuthRedirect = () => {
  const { isAuthenticated, currentUser } = useAuth();
  
  if (isAuthenticated) {
    // Redirect admin users to admin panel, others to dashboard
    return currentUser?.role === 'admin' 
      ? <Navigate to="/admin" replace /> 
      : <Navigate to="/dashboard" replace />;
  }
  
  // If not authenticated, redirect to login
  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            {/* Navigation removed */}
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<AuthRedirect />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                } 
              >
                <Route index element={<Dashboard />} />
                <Route path="category/:main" element={<CategoryPage />} />
                <Route path="category/:main/:sub" element={<CategoryPage />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="analytics/overview" element={<Overview />} />
                <Route path="analytics/products" element={<ProductStats />} />
                <Route path="analytics/users" element={<UserStats />} />
                <Route path="analytics/most-viewed" element={<MostViewedProducts />} />
                <Route path="analytics/most-bought" element={<MostBoughtProducts />} />
                <Route path="analytics/top-exclusive" element={<TopExclusiveProducts />} />
              </Route>
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminLayout />
                  </ProtectedRoute>
                } 
              >
                <Route index element={<ModeratorList />} />
                <Route path="moderators" element={<ModeratorList />} />
                <Route path="companies" element={<CompanyList />} />
              </Route>
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
