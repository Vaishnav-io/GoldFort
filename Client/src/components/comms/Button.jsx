import React from 'react';
import { motion } from 'framer-motion';

const variants = {
  initial: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

const Button = ({ 
  children, 
  onClick, 
  className = '', 
  type = 'button', 
  disabled = false,
  variant = 'primary',
  fullWidth = false,
  icon = null
}) => {
  const baseClasses = 'flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
    outline: 'bg-transparent border border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
  };
  
  const sizeClasses = fullWidth ? 'w-full' : '';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses} ${disabledClasses} ${className}`;
  
  return (
    <motion.button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      variants={variants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {icon && <span className="text-lg">{icon}</span>}
      {children}
    </motion.button>
  );
};

export default Button;