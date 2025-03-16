import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiLoader, FiCheckCircle, FiX } from 'react-icons/fi';
import { verifyOTP, resendOTP, resetPassword, reset } from '../../features/auth/authSlice';
import Button from '../../components/comms/Button';

const VerifyOTP = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const inputRefs = useRef([]);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, isSuccess, isError, message } = useSelector(state => state.auth);
  
  useEffect(() => {
    // If user is already verified, redirect to home page
    if (user && user.isVerified) {
      navigate('/');
    }
    
    // If user is logged in but not verified, pre-fill email
    if (user && !user.isVerified) {
      setEmail(user.email);
    }
    
    return () => {
      dispatch(reset());
    };
  }, [user, navigate, dispatch]);
  
  useEffect(() => {
    // Focus first input on component mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);
  
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  
  const handleOtpChange = (e, index) => {
    const { value } = e.target;
    
    // Allow only numbers
    if (value && !/^\d+$/.test(value)) {
      return;
    }
    
    // Update OTP array
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };
  
  const handleKeyDown = (e, index) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };
  
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    
    // Check if pasted data is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      
      // Focus last input
      inputRefs.current[5].focus();
    }
  };
  
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError('');
  };
  
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordError('');
  };
  
  const validatePassword = () => {
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return false;
    }
    
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    
    return true;
  };
  
  const handleVerifyOTP = (e) => {
    e.preventDefault();
    
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      return;
    }
    
    if (isResettingPassword) {
      setIsPasswordReset(true);
    } else {
      dispatch(verifyOTP({ email, otp: otpString }));
    }
  };
  
  const handleResetPassword = (e) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      return;
    }
    
    const otpString = otp.join('');
    
    dispatch(resetPassword({
      email,
      otp: otpString,
      password,
    }));
  };
  
  const handleResendOTP = () => {
    dispatch(resendOTP({ email }));
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
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md"
        initial="hidden"
        animate="visible"
        variants={formVariants}
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            {isPasswordReset ? 'Create New Password' : 'Verify OTP'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isPasswordReset 
              ? 'Enter your new password below' 
              : `Enter the 6-digit code sent to ${email || 'your email'}`
            }
          </p>
        </div>
        
        {isError && (
          <motion.div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {message}
          </motion.div>
        )}
        
        {isSuccess && !isResettingPassword && (
          <motion.div
            className="text-center py-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FiCheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Verification Successful</h3>
            <p className="text-gray-600 mb-6">
              Your account has been verified successfully.
            </p>
            <Button
              onClick={() => navigate('/')}
              variant="primary"
              fullWidth
            >
              Continue to Home
            </Button>
          </motion.div>
        )}
        
        {isSuccess && isResettingPassword && (
          <motion.div
            className="text-center py-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FiCheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Password Reset Successful</h3>
            <p className="text-gray-600 mb-6">
              Your password has been reset successfully. You can now login with your new password.
            </p>
            <Button
              onClick={() => navigate('/login')}
              variant="primary"
              fullWidth
            >
              Go to Login
            </Button>
          </motion.div>
        )}
        
        {!isSuccess && !isPasswordReset && (
          <form className="mt-8 space-y-6" onSubmit={handleVerifyOTP}>
            {!user && (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={handleEmailChange}
                  className="appearance-none rounded-md relative block w-full py-2 px-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your email address"
                  disabled={!!user}
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter 6-Digit OTP
              </label>
              <div className="flex gap-2">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={otp[index]}
                    onChange={(e) => handleOtpChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-full h-12 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                  disabled={isLoading}
                >
                  Resend OTP
                </button>
              </div>
              
              <div className="text-sm">
                <button
                  type="button"
                  onClick={() => setIsResettingPassword(!isResettingPassword)}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  {isResettingPassword ? 'Cancel Password Reset' : 'Reset Password'}
                </button>
              </div>
            </div>
            
            <div>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                className="py-3"
                disabled={isLoading || otp.some(digit => digit === '')}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <FiLoader className="animate-spin mr-2" /> Verifying...
                  </span>
                ) : (
                  'Verify OTP'
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
        
        {!isSuccess && isPasswordReset && (
          <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
            {passwordError && (
              <motion.div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {passwordError}
              </motion.div>
            )}
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={handlePasswordChange}
                className="appearance-none rounded-md relative block w-full py-2 px-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Minimum 6 characters"
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className="appearance-none rounded-md relative block w-full py-2 px-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Confirm your new password"
              />
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setIsPasswordReset(false)}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Back
              </button>
              
              <Button
                type="submit"
                variant="primary"
                className="px-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <FiLoader className="animate-spin mr-2" /> Resetting...
                  </span>
                ) : (
                  'Reset Password'
                )}
              </Button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyOTP;