import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit2, FiPlus, FiTrash2, FiX, FiCheck } from 'react-icons/fi';
import { 
  getUserProfile, 
  updateUserProfile, 
  addUserAddress, 
  updateUserAddress, 
  deleteUserAddress, 
  setDefaultAddress 
} from '../../features/user/userSlice';
import { getMyOrders } from '../../features/order/orderSlice';
import Button from '../../components/comms/Button';

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user, profile, isLoading, isError, message } = useSelector(state => state.user);
  const { orders } = useSelector(state => state.order);
  
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [addressData, setAddressData] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    default: false,
  });
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      dispatch(getUserProfile());
      dispatch(getMyOrders());
    }
  }, [user, navigate, dispatch]);
  
  useEffect(() => {
    if (profile) {
      setProfileData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        password: '',
        confirmPassword: '',
      });
    }
  }, [profile]);
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    if (name === 'password' || name === 'confirmPassword') {
      setPasswordError('');
    }
  };
  
  const validatePassword = () => {
    // Skip validation if no password is provided (user not changing password)
    if (!profileData.password) return true;
    
    if (profileData.password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return false;
    }
    
    if (profileData.password !== profileData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    
    return true;
  };
  
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      return;
    }
    
    const userData = {
      name: profileData.name,
      email: profileData.email,
      phone: profileData.phone,
    };
    
    if (profileData.password) {
      userData.password = profileData.password;
    }
    
    dispatch(updateUserProfile(userData));
  };
  
  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  
  const handleOpenAddressModal = (address = null) => {
    if (address) {
      setCurrentAddress(address);
      setAddressData({
        street: address.street,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country,
        default: address.default,
      });
    } else {
      setCurrentAddress(null);
      setAddressData({
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        default: false,
      });
    }
    setShowAddressModal(true);
  };
  
  const handleCloseAddressModal = () => {
    setShowAddressModal(false);
  };
  
  const handleAddressSubmit = (e) => {
    e.preventDefault();
    
    if (currentAddress) {
      dispatch(updateUserAddress({
        addressId: currentAddress._id,
        addressData: addressData,
      }));
    } else {
      dispatch(addUserAddress(addressData));
    }
    
    setShowAddressModal(false);
  };
  
  const handleDeleteAddress = (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      dispatch(deleteUserAddress(addressId));
    }
  };
  
  const handleSetDefaultAddress = (addressId) => {
    dispatch(setDefaultAddress(addressId));
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
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
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">My Account</h1>
          
          {isError && (
            <motion.div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {message}
            </motion.div>
          )}
          
          <div className="bg-white rounded-lg shadow">
            {/* Tabs */}
            <div className="border-b">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`py-4 px-6 text-sm font-medium ${
                    activeTab === 'profile'
                      ? 'border-b-2 border-indigo-500 text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`py-4 px-6 text-sm font-medium ${
                    activeTab === 'orders'
                      ? 'border-b-2 border-indigo-500 text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Orders
                </button>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`py-4 px-6 text-sm font-medium ${
                    activeTab === 'addresses'
                      ? 'border-b-2 border-indigo-500 text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Addresses
                </button>
              </nav>
            </div>
            
            {/* Tab Content */}
            <div className="p-6">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : (
                <>
                  {/* Profile Tab */}
                  {activeTab === 'profile' && (
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.h2 
                        className="text-xl font-medium mb-6"
                        variants={itemVariants}
                      >
                        Personal Information
                      </motion.h2>
                      
                      <motion.form 
                        onSubmit={handleProfileSubmit}
                        variants={itemVariants}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                              Full Name
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiUser className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                type="text"
                                id="name"
                                name="name"
                                value={profileData.name}
                                onChange={handleProfileChange}
                                className="appearance-none rounded-md relative block w-full pl-10 py-2 px-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                              Email Address
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiMail className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                type="email"
                                id="email"
                                name="email"
                                value={profileData.email}
                                onChange={handleProfileChange}
                                className="appearance-none rounded-md relative block w-full pl-10 py-2 px-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="mb-6">
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number (Optional)
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FiPhone className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              value={profileData.phone}
                              onChange={handleProfileChange}
                              className="appearance-none rounded-md relative block w-full pl-10 py-2 px-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </div>
                        </div>
                        
                        <motion.h3 
                          className="text-lg font-medium mb-4 border-t pt-6"
                          variants={itemVariants}
                        >
                          Change Password (Optional)
                        </motion.h3>
                        
                        {passwordError && (
                          <motion.div
                            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            {passwordError}
                          </motion.div>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                              New Password
                            </label>
                            <input
                              type="password"
                              id="password"
                              name="password"
                              value={profileData.password}
                              onChange={handleProfileChange}
                              className="appearance-none rounded-md relative block w-full py-2 px-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="Leave blank to keep current password"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              id="confirmPassword"
                              name="confirmPassword"
                              value={profileData.confirmPassword}
                              onChange={handleProfileChange}
                              className="appearance-none rounded-md relative block w-full py-2 px-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="Leave blank to keep current password"
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <Button type="submit" variant="primary">
                            Save Changes
                          </Button>
                        </div>
                      </motion.form>
                    </motion.div>
                  )}
                  
                  {/* Orders Tab */}
                  {activeTab === 'orders' && (
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.h2 
                        className="text-xl font-medium mb-6"
                        variants={itemVariants}
                      >
                        Order History
                      </motion.h2>
                      
                      {orders && orders.length === 0 ? (
                        <motion.div
                          className="text-center py-8"
                          variants={itemVariants}
                        >
                          <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
                          <Button
                            onClick={() => navigate('/products')}
                            variant="primary"
                          >
                            Start Shopping
                          </Button>
                        </motion.div>
                      ) : (
                        <motion.div
                          className="overflow-x-auto"
                          variants={itemVariants}
                        >
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Order ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Total
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
                              {orders && orders.map((order) => (
                                <tr key={order._id}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    #{order._id.substring(order._id.length - 6).toUpperCase()}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ${order.totalPrice.toFixed(2)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                      ${order.isPaid 
                                        ? order.isDelivered 
                                          ? 'bg-green-100 text-green-800' 
                                          : 'bg-yellow-100 text-yellow-800' 
                                        : 'bg-red-100 text-red-800'}`}
                                    >
                                      {order.isPaid 
                                        ? order.isDelivered 
                                          ? 'Delivered' 
                                          : 'Processing' 
                                        : 'Pending'}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <Button
                                      onClick={() => navigate(`/order/${order._id}`)}
                                      variant="outline"
                                      className="text-xs py-1 px-3"
                                    >
                                      View Details
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                  
                  {/* Addresses Tab */}
                  {activeTab === 'addresses' && (
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <div className="flex justify-between items-center mb-6">
                        <motion.h2 
                          className="text-xl font-medium"
                          variants={itemVariants}
                        >
                          Saved Addresses
                        </motion.h2>
                        
                        <motion.div variants={itemVariants}>
                          <Button
                            onClick={() => handleOpenAddressModal()}
                            variant="primary"
                            className="flex items-center"
                            icon={<FiPlus className="mr-1" />}
                          >
                            Add Address
                          </Button>
                        </motion.div>
                      </div>
                      
                      {profile && profile.addresses && profile.addresses.length === 0 ? (
                        <motion.div
                          className="text-center py-8 border rounded-lg"
                          variants={itemVariants}
                        >
                          <FiMapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                          <p className="text-gray-500 mb-4">You don't have any saved addresses yet.</p>
                          <Button
                            onClick={() => handleOpenAddressModal()}
                            variant="primary"
                          >
                            Add Address
                          </Button>
                        </motion.div>
                      ) : (
                        <motion.div
                          className="grid grid-cols-1 md:grid-cols-2 gap-6"
                          variants={containerVariants}
                        >
                          {profile && profile.addresses && profile.addresses.map((address) => (
                            <motion.div
                              key={address._id}
                              className={`border rounded-lg p-4 relative ${
                                address.default ? 'border-indigo-500 bg-indigo-50' : ''
                              }`}
                              variants={itemVariants}
                            >
                              {address.default && (
                                <span className="absolute top-2 right-2 bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-0.5 rounded">
                                  Default
                                </span>
                              )}
                              
                              <div className="mb-2 font-medium">
                                {profile.name}
                              </div>
                              
                              <div className="text-gray-700 mb-4">
                                <p>{address.street}</p>
                                <p>
                                  {address.city}, {address.state} {address.postalCode}
                                </p>
                                <p>{address.country}</p>
                              </div>
                              
                              <div className="flex space-x-2">
                                <Button
                                  onClick={() => handleOpenAddressModal(address)}
                                  variant="outline"
                                  className="text-xs py-1 px-2 flex items-center"
                                  icon={<FiEdit2 className="mr-1" />}
                                >
                                  Edit
                                </Button>
                                
                                {!address.default && (
                                  <Button
                                    onClick={() => handleSetDefaultAddress(address._id)}
                                    variant="outline"
                                    className="text-xs py-1 px-2 flex items-center"
                                    icon={<FiCheck className="mr-1" />}
                                  >
                                    Set as Default
                                  </Button>
                                )}
                                
                                <Button
                                  onClick={() => handleDeleteAddress(address._id)}
                                  variant="danger"
                                  className="text-xs py-1 px-2 flex items-center bg-red-600 text-white hover:bg-red-700"
                                  icon={<FiTrash2 className="mr-1" />}
                                >
                                  Delete
                                </Button>
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Address Modal */}
      <AnimatePresence>
        {showAddressModal && (
          <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseAddressModal}
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
                  {currentAddress ? 'Edit Address' : 'Add New Address'}
                </h3>
                <button
                  onClick={handleCloseAddressModal}
                  className="text-white hover:text-gray-200"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={handleAddressSubmit} className="px-6 py-4">
                <div className="mb-4">
                  <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    value={addressData.street}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={addressData.city}
                      onChange={handleAddressChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      State/Province
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={addressData.state}
                      onChange={handleAddressChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={addressData.postalCode}
                      onChange={handleAddressChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={addressData.country}
                      onChange={handleAddressChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="default"
                      name="default"
                      checked={addressData.default}
                      onChange={handleAddressChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="default" className="ml-2 block text-sm text-gray-900">
                      Set as default address
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleCloseAddressModal}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {currentAddress ? 'Update Address' : 'Save Address'}
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

export default UserProfile;