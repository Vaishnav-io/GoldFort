import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { getUsers, updateUser, deleteUser } from '../../features/user/userSlice';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import Button from '../../components/comms/Button';

const Users = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.auth);
  const { users, isLoading, isError, message } = useSelector((state) => state.user);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    isAdmin: false,
  });
  
  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      dispatch(getUsers());
    } else {
      navigate('/login');
    }
  }, [dispatch, navigate, currentUser]);
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredUsers = users.filter((user) => {
    const { name, email } = user;
    const searchLower = searchTerm.toLowerCase();
    
    return (
      name.toLowerCase().includes(searchLower) ||
      email.toLowerCase().includes(searchLower)
    );
  });
  
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
    setShowModal(true);
  };
  
  const handleDeleteUser = (userId) => {
    if (userId === currentUser._id) {
      alert("You cannot delete your own account!");
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(userId));
    }
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (selectedUser) {
      dispatch(updateUser({
        userId: selectedUser._id,
        userData: formData,
      }));
    }
    
    setShowModal(false);
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
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
        duration: 0.4,
      },
    },
  };
  
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader title="Users" />
        
        <main className="flex-1 overflow-y-auto p-4">
          <motion.div
            className="max-w-7xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              variants={itemVariants}
            >
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </motion.div>
            
            {isError && (
              <motion.div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {message}
              </motion.div>
            )}
            
            <motion.div
              className="bg-white rounded-lg shadow overflow-hidden"
              variants={itemVariants}
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {isLoading ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center">
                          <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500"></div>
                          </div>
                        </td>
                      </tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                          No users found
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-lg">
                                  {user.name.charAt(0).toUpperCase()}
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.isAdmin ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                Admin
                              </span>
                            ) : (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                Customer
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${user.isVerified 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'}`}
                            >
                              {user.isVerified ? 'Verified' : 'Not Verified'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditUser(user)}
                                className="text-indigo-600 hover:text-indigo-900"
                                disabled={user._id === currentUser._id}
                              >
                                <FiEdit2 className={`h-5 w-5 ${user._id === currentUser._id ? 'opacity-50' : ''}`} />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user._id)}
                                className="text-red-600 hover:text-red-900"
                                disabled={user._id === currentUser._id}
                              >
                                <FiTrash2 className={`h-5 w-5 ${user._id === currentUser._id ? 'opacity-50' : ''}`} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        </main>
      </div>
      
      {/* Edit User Modal */}
      <AnimatePresence>
        {showModal && selectedUser && (
          <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
            ></motion.div>
            
            <motion.div
              className="bg-white rounded-lg overflow-hidden shadow-xl transform w-full max-w-md z-10 mx-4"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="px-6 py-4 bg-indigo-600 text-white flex justify-between items-center">
                <h3 className="text-lg font-medium">
                  Edit User
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-white hover:text-gray-200"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="px-6 py-4">
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isAdmin"
                      name="isAdmin"
                      checked={formData.isAdmin}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isAdmin" className="ml-2 block text-sm text-gray-900">
                      Admin Privileges
                    </label>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Admins can manage products, orders, and other users.
                  </p>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Users;