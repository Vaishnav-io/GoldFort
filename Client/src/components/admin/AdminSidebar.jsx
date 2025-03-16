import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiPackage, FiShoppingCart, FiUsers, FiSettings, FiChevronLeft, FiLogOut } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

const AdminSidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const handleLogout = () => {
    dispatch(logout());
  };
  
  const sidebarItems = [
    {
      name: 'Dashboard',
      icon: <FiHome />,
      path: '/admin',
    },
    {
      name: 'Products',
      icon: <FiPackage />,
      path: '/admin/products',
    },
    {
      name: 'Orders',
      icon: <FiShoppingCart />,
      path: '/admin/orders',
    },
    {
      name: 'Users',
      icon: <FiUsers />,
      path: '/admin/users',
    },
    {
      name: 'Settings',
      icon: <FiSettings />,
      path: '/admin/settings',
    },
  ];
  
  // Check if current path matches item path
  const isActive = (path) => {
    return location.pathname === path || 
           (path !== '/admin' && location.pathname.startsWith(path));
  };
  
  // Animation variants
  const sidebarVariants = {
    expanded: { width: '240px' },
    collapsed: { width: '70px' },
  };
  
  return (
    <motion.aside
      className={`bg-white border-r h-screen ${isCollapsed ? 'overflow-x-hidden' : ''}`}
      initial="expanded"
      animate={isCollapsed ? 'collapsed' : 'expanded'}
      variants={sidebarVariants}
      transition={{ duration: 0.3 }}
    >
      <div className="h-full flex flex-col justify-between">
        <div>
          <div className="px-4 py-5 flex items-center justify-between">
            {!isCollapsed && (
              <Link to="/admin" className="text-xl font-bold text-indigo-600">
                GemElegance
              </Link>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500"
            >
              <motion.div
                animate={{ rotate: isCollapsed ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <FiChevronLeft />
              </motion.div>
            </button>
          </div>
          
          <nav className="mt-5 px-2">
            <ul className="space-y-1">
              {sidebarItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-2 py-3 text-sm font-medium rounded-lg ${
                      isActive(item.path)
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <div className="text-xl mr-3">{item.icon}</div>
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        
        <div className="px-2 mb-6">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-2 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
          >
            <div className="text-xl mr-3">
              <FiLogOut />
            </div>
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </motion.aside>
  );
};

export default AdminSidebar;