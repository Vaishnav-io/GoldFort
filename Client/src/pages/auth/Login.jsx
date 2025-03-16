import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiLoader, FiAlertCircle, FiX } from 'react-icons/fi';
import { login, reset } from '../../features/auth/authSlice';
import Button from '../../components/comms/Button';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  
  const { email, password } = formData;
  
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector(state => state.auth);
  
  const redirect = location.search ? location.search.split('=')[1] : '/';
  
  // Show toast message for 5 seconds
  useEffect(() => {
    let toastTimer;
    if (toast.show) {
      toastTimer = setTimeout(() => {
        setToast({ ...toast, show: false });
      }, 5000);
    }
    
    return () => {
      clearTimeout(toastTimer);
    };
  }, [toast]);
  
  // Handle Redux state changes
  useEffect(() => {
    if (isError) {
      // Show error toast
      setToast({ 
        show: true, 
        message: message || 'Login failed. Please check your credentials.', 
        type: 'error' 
      });
    }
    
    if (isSuccess) {
      // Show success toast before redirecting
      setToast({ 
        show: true, 
        message: 'Login successful!', 
        type: 'success' 
      });
    }
    
    // Navigate on success
    if (isSuccess || user) {
      // Short delay to show success toast before redirect
      const redirectTimer = setTimeout(() => {
        navigate(redirect);
      }, 1000);
      
      return () => clearTimeout(redirectTimer);
    }
    
    return () => {
      dispatch(reset());
    };
  }, [user, isSuccess, isError, message, navigate, dispatch, redirect]);
  
  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const userData = {
      email,
      password,
    };
    
    dispatch(login(userData));
  };
  
  const closeToast = () => {
    setToast({ ...toast, show: false });
  };
  
  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };
  
  const toastVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      }
    },
    exit: { 
      opacity: 0, 
      y: -50,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      }
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Toast notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div 
            className={`fixed top-4 right-4 z-50 max-w-md p-4 rounded-md shadow-lg flex items-start space-x-3 ${
              toast.type === 'error' ? 'bg-red-100 text-red-800 border-l-4 border-red-500' :
              toast.type === 'success' ? 'bg-green-100 text-green-800 border-l-4 border-green-500' :
              'bg-blue-100 text-blue-800 border-l-4 border-blue-500'
            }`}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={toastVariants}
          >
            <div className="flex-shrink-0 pt-0.5">
              {toast.type === 'error' && <FiAlertCircle className="h-5 w-5 text-red-500" />}
              {toast.type === 'success' && <FiAlertCircle className="h-5 w-5 text-green-500" />}
              {toast.type !== 'error' && toast.type !== 'success' && <FiAlertCircle className="h-5 w-5 text-blue-500" />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{toast.message}</p>
            </div>
            <button 
              className="flex-shrink-0 text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={closeToast}
            >
              <FiX className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md"
        initial="hidden"
        animate="visible"
        variants={formVariants}
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              create an account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={handleChange}
                  className="appearance-none rounded-md relative block w-full pl-10 py-2 px-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Email address"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={handleChange}
                  className="appearance-none rounded-md relative block w-full pl-10 py-2 px-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>
            
            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </Link>
            </div>
          </div>
          
          <div>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              className="py-3"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <FiLoader className="animate-spin mr-2" /> Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;