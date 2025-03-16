import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiUser, FiChevronDown } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

const AdminHeader = ({ title }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const handleLogout = () => {
    dispatch(logout());
  };
  
  // Mock notifications (in a real app, these would come from an API)
  const notifications = [
    {
      id: 1,
      message: 'New order received',
      time: '5 minutes ago',
      read: false,
    },
    {
      id: 2,
      message: 'Product stock running low',
      time: '2 hours ago',
      read: true,
    },
    {
      id: 3,
      message: 'New user registered',
      time: 'Yesterday',
      read: true,
    },
  ];
  
  // Animation variants
  const menuVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
      },
    },
  };
  
  return (
    <header className="bg-white border-b py-4 px-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">{title}</h1>
        
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-1.5 rounded-full hover:bg-gray-100 relative"
            >
              <FiBell className="text-gray-600 text-xl" />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              )}
            </button>
            
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-10"
                  variants={menuVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className="px-4 py-3 border-b">
                    <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
                  </div>
                  
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="py-4 px-4 text-center text-gray-500 text-sm">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 border-b hover:bg-gray-50 ${
                            !notification.read ? 'bg-blue-50' : ''
                          }`}
                        >
                          <p className="text-sm text-gray-800">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <div className="px-4 py-2 border-t text-center">
                    <button className="text-sm text-indigo-600 hover:text-indigo-800">
                      Mark all as read
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center text-gray-700 focus:outline-none"
            >
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <span className="ml-2 hidden md:block">{user?.name || 'Admin'}</span>
              <FiChevronDown className="ml-1" />
            </button>
            
            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-10"
                  variants={menuVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Your Profile
                    </Link>
                    <Link
                      to="/admin/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;