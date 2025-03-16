import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiHeart, FiUser, FiSearch, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { logout } from '../../features/auth/authSlice';
import { searchProducts } from '../../features/product/productSlice';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { items: cartItems } = useSelector(state => state.cart);
  const { items: wishlistItems } = useSelector(state => state.wishlist);
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  
  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isProfileMenuOpen && !e.target.closest('.profile-menu')) {
        setIsProfileMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      dispatch(searchProducts(searchTerm));
      navigate('/products');
      setSearchTerm('');
      setIsSearchVisible(false);
    }
  };
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsProfileMenuOpen(false);
  };
  
  // Animation variants
  const navbarVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };
  
  const searchVariants = {
    hidden: { opacity: 0, width: 0 },
    visible: { 
      opacity: 1, 
      width: "100%",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    exit: { 
      opacity: 0, 
      width: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };
  
  const menuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };
  
  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}
      variants={navbarVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-indigo-600">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              GemElegance
            </motion.span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-indigo-600 transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-indigo-600 transition-colors">
              Shop
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-indigo-600 transition-colors">
              About Us
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-indigo-600 transition-colors">
              Contact
            </Link>
          </div>
          
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Toggle */}
            <motion.button
              onClick={() => setIsSearchVisible(!isSearchVisible)}
              className="text-gray-700 hover:text-indigo-600 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiSearch className="text-xl" />
            </motion.button>
            
            {/* Wishlist */}
            <Link to="/wishlist">
              <motion.div
                className="text-gray-700 hover:text-indigo-600 transition-colors relative"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiHeart className="text-xl" />
                {wishlistItems.length > 0 && (
                  <motion.span
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  >
                    {wishlistItems.length}
                  </motion.span>
                )}
              </motion.div>
            </Link>
            
            {/* Cart */}
            <Link to="/cart">
              <motion.div
                className="text-gray-700 hover:text-indigo-600 transition-colors relative"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiShoppingCart className="text-xl" />
                {cartItems.length > 0 && (
                  <motion.span
                    className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  >
                    {cartItems.length}
                  </motion.span>
                )}
              </motion.div>
            </Link>
            
            {/* User Profile / Login */}
            <div className="relative profile-menu">
              <motion.button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="text-gray-700 hover:text-indigo-600 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiUser className="text-xl" />
              </motion.button>
              
              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-10"
                    variants={menuVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <div className="py-1">
                      {user ? (
                        <>
                          <div className="px-4 py-2 border-b">
                            <p className="text-sm font-medium text-gray-900">Hello, {user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                          <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <FiUser className="mr-2" /> My Profile
                          </Link>
                          {user.isAdmin && (
                            <Link to="/admin" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              <FiUser className="mr-2" /> Admin Dashboard
                            </Link>
                          )}
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <FiLogOut className="mr-2" /> Logout
                          </button>
                        </>
                      ) : (
                        <>
                          <Link to="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Login
                          </Link>
                          <Link to="/register" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Register
                          </Link>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-indigo-600 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isMobileMenuOpen ? (
                <FiX className="text-2xl" />
              ) : (
                <FiMenu className="text-2xl" />
              )}
            </motion.button>
          </div>
        </div>
        
        {/* Search Bar */}
        <AnimatePresence>
          {isSearchVisible && (
            <motion.div
              className="py-4"
              variants={searchVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search for jewelry..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-600"
                >
                  <FiSearch className="text-xl" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden bg-white shadow-lg"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.nav className="py-4 px-6 space-y-4" variants={itemVariants}>
              <Link
                to="/"
                className="block text-gray-700 hover:text-indigo-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="block text-gray-700 hover:text-indigo-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                to="/about"
                className="block text-gray-700 hover:text-indigo-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="block text-gray-700 hover:text-indigo-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </motion.nav>
            
            <div className="py-4 px-6 border-t flex justify-around">
              <Link
                to="/wishlist"
                className="flex flex-col items-center text-gray-700 hover:text-indigo-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="relative">
                  <FiHeart className="text-xl" />
                  {wishlistItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {wishlistItems.length}
                    </span>
                  )}
                </div>
                <span className="text-xs mt-1">Wishlist</span>
              </Link>
              
              <Link
                to="/cart"
                className="flex flex-col items-center text-gray-700 hover:text-indigo-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="relative">
                  <FiShoppingCart className="text-xl" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {cartItems.length}
                    </span>
                  )}
                </div>
                <span className="text-xs mt-1">Cart</span>
              </Link>
              
              {user ? (
                <Link
                  to="/profile"
                  className="flex flex-col items-center text-gray-700 hover:text-indigo-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FiUser className="text-xl" />
                  <span className="text-xs mt-1">Profile</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="flex flex-col items-center text-gray-700 hover:text-indigo-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FiUser className="text-xl" />
                  <span className="text-xs mt-1">Login</span>
                </Link>
              )}
              
              {user && (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex flex-col items-center text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  <FiLogOut className="text-xl" />
                  <span className="text-xs mt-1">Logout</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;