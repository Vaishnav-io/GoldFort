import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiAlertCircle, FiArrowLeft } from 'react-icons/fi';
import Button from '../components/comms/Button';

const NotFound = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.2,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-md w-full text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="mb-8"
          variants={itemVariants}
        >
          <FiAlertCircle className="mx-auto h-24 w-24 text-indigo-500" />
        </motion.div>
        
        <motion.h1 
          className="text-6xl font-bold text-gray-900 mb-4"
          variants={itemVariants}
        >
          404
        </motion.h1>
        
        <motion.h2 
          className="text-3xl font-medium text-gray-700 mb-6"
          variants={itemVariants}
        >
          Page Not Found
        </motion.h2>
        
        <motion.p 
          className="text-lg text-gray-600 mb-8"
          variants={itemVariants}
        >
          The page you're looking for doesn't exist or has been moved.
        </motion.p>
        
        <motion.div
          variants={itemVariants}
        >
          <Link to="/">
            <Button
              variant="primary"
              className="mx-auto flex items-center justify-center"
              icon={<FiArrowLeft className="mr-2" />}
            >
              Back to Home
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;