import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Provider } from 'react-redux';
import { store } from './store';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Page Components
import Home from './pages/Home';
import ProductList from './pages/product/ProductList';
import ProductDetail from './pages/product/ProductDetail';
import Cart from './pages/checkout/Cart';
import Checkout from './pages/checkout/Checkout';
import Wishlist from './pages/Wishlist';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import VerifyOTP from './pages/auth/VerifyOTP';
import UserProfile from './pages/user/UserProfile';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import AdminUsers from './pages/admin/Users';
import NotFound from './pages/NotFound';

// Auth Provider
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <AnimatePresence mode="wait">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<ProductList />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/verify-otp" element={<VerifyOTP />} />
                  
                  {/* Protected User Routes */}
                  <Route path="/profile" element={<UserProfile />} />
                  <Route path="/checkout" element={<Checkout />} />
                  
                  {/* Protected Admin Routes */}
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/products" element={<AdminProducts />} />
                  <Route path="/admin/orders" element={<AdminOrders />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                  
                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AnimatePresence>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  );
}

export default App;