import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';

// Components
import Navigation from './components/Navigation';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Unauthorized from './components/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import CategoryPage from './components/dashboard/CategoryPage';

// Create a client for React Query
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <Routes>
              <Route path="/login" element={<Login />} />
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
              </Route>
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <div className="p-8">
                      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
                      <p>This page is only accessible to admin users.</p>
                    </div>
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
