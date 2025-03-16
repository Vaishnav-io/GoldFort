import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLoader, FiCheckCircle, FiAlertCircle, FiX } from 'react-icons/fi';
import { forgotPassword, reset } from '../../features/auth/authSlice';
import Button from '../../components/comms/Button';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, isSuccess, isError, message } = useSelector(state => state.auth);
  
  // Auto-hide toast after 5 seconds
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
      setToast({
        show: true,
        message: message || 'Failed to send reset instructions. Please try again.',
        type: 'error'
      });
    }
    
    if (isSuccess && submitted) {
      setToast({
        show: true,
        message: `Reset instructions sent to ${email}`,
        type: 'success'
      });
    }
    
    return () => {
      dispatch(reset());
    };
  }, [isSuccess, isError, message, email, submitted, dispatch]);
  
  const handleChange = (e) => {
    setEmail(e.target.value);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
    setSubmitted(true);
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
              {toast.type === 'success' && <FiCheckCircle className="h-5 w-5 text-green-500" />}
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
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you an OTP to reset your password.
          </p>
        </div>
        
        {isSuccess && submitted ? (
          <motion.div
            className="text-center py-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FiCheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Check your email</h3>
            <p className="text-gray-600 mb-6">
              We've sent an OTP to {email}. Please check your email and enter the code on the verification page.
            </p>
            <Button
              onClick={() => navigate('/verify-otp')}
              variant="primary"
              fullWidth
            >
              Enter OTP
            </Button>
          </motion.div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
                  placeholder="Enter your email address"
                />
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
                    <FiLoader className="animate-spin mr-2" /> Sending...
                  </span>
                ) : (
                  'Send Reset OTP'
                )}
              </Button>
            </div>
            
            <div className="text-center">
              <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Back to login
              </Link>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;