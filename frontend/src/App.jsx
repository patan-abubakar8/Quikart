import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/layout/Layout';
import AdminLayout from './components/admin/AdminLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductManagement from './pages/admin/ProductManagement';
import AddProduct from './pages/admin/AddProduct';
import CategoryManagement from './pages/admin/CategoryManagement';
import Notifications from './pages/admin/Notifications';
import ProductView from './pages/admin/ProductView';
import EditProduct from './pages/admin/EditProduct';
import Debug from './components/Debug';
import SimpleLogin from './components/SimpleLogin';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function App() {
  console.log('App component rendering'); // Debug log

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                }}
              />
              
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/simple-login" element={<SimpleLogin />} />
                <Route path="/register" element={<Register />} />
                
                {/* Debug Route */}
                <Route path="/debug" element={<Debug />} />
                
                {/* Test Route */}
                <Route path="/test" element={<div className="p-8 text-black"><h1>Test Route Works!</h1></div>} />
                
                {/* Customer Protected Routes */}
                <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                  <Route index element={<Navigate to="/products" replace />} />
                  <Route path="products" element={<Products />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="checkout" element={<Checkout />} />
                  <Route path="payment" element={<Payment />} />
                </Route>

                {/* Admin Protected Routes */}
                <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<ProductManagement />} />
                  <Route path="products/add" element={<AddProduct />} />
                  <Route path="products/:productId" element={<ProductView />} />
                  <Route path="products/:productId/edit" element={<EditProduct />} />
                  <Route path="categories" element={<CategoryManagement />} />
                  <Route path="notifications" element={<Notifications />} />
                </Route>
                
                {/* Catch all route - redirect to login for unauthenticated users */}
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;