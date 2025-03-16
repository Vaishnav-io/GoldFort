import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiEye, FiTruck, FiX, FiCheck } from 'react-icons/fi';
import { getOrders, updateOrderToDelivered, deleteOrder } from '../../features/order/orderSlice';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import Button from '../../components/comms/Button';
const Orders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { orders, isLoading, isError, message } = useSelector((state) => state.order);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  
  useEffect(() => {
    if (user && user.isAdmin) {
      dispatch(getOrders());
    } else {
      navigate('/login');
    }
  }, [dispatch, navigate, user]);
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };
  
  const filteredOrders = orders.filter((order) => {
    // Apply status filter
    if (filterStatus === 'pending' && order.isPaid) return false;
    if (filterStatus === 'processing' && (!order.isPaid || order.isDelivered)) return false;
    if (filterStatus === 'delivered' && !order.isDelivered) return false;
    
    // Apply search filter
    const orderId = order._id.toLowerCase();
    const userName = order.user && order.user.name ? order.user.name.toLowerCase() : '';
    const userEmail = order.user && order.user.email ? order.user.email.toLowerCase() : '';
    const searchLower = searchTerm.toLowerCase();
    
    return orderId.includes(searchLower) || 
           userName.includes(searchLower) || 
           userEmail.includes(searchLower);
  });
  
  const handleViewOrder = (order) => {
    setCurrentOrder(order);
    setShowModal(true);
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
  };
  
  const handleMarkAsDelivered = (orderId) => {
    dispatch(updateOrderToDelivered(orderId));
    setShowModal(false);
  };
  
  const handleDeleteOrder = (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      dispatch(deleteOrder(orderId));
      setShowModal(false);
    }
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
        <AdminHeader title="Orders" />
        
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
              <div className="flex flex-col md:flex-row gap-4 md:items-center flex-grow">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                
                <select
                  value={filterStatus}
                  onChange={handleFilterChange}
                  className="block w-full md:w-48 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="all">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="delivered">Delivered</option>
                </select>
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
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
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
                    {isLoading ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center">
                          <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500"></div>
                          </div>
                        </td>
                      </tr>
                    ) : filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                          No orders found
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{order._id.substring(order._id.length - 6).toUpperCase()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.user && order.user.name ? (
                              <div>
                                <div>{order.user.name}</div>
                                <div className="text-xs text-gray-400">{order.user.email}</div>
                              </div>
                            ) : (
                              'N/A'
                            )}
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleViewOrder(order)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                <FiEye className="h-5 w-5" />
                              </button>
                              {order.isPaid && !order.isDelivered && (
                                <button
                                  onClick={() => handleMarkAsDelivered(order._id)}
                                  className="text-green-600 hover:text-green-900"
                                  title="Mark as Delivered"
                                >
                                  <FiTruck className="h-5 w-5" />
                                </button>
                              )}
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
      
      {/* Order Details Modal */}
      <AnimatePresence>
        {showModal && currentOrder && (
          <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
            ></motion.div>
            
            <motion.div
              className="bg-white rounded-lg overflow-hidden shadow-xl transform w-full max-w-4xl z-10 mx-4 max-h-[90vh] overflow-y-auto"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="px-6 py-4 bg-indigo-600 text-white flex justify-between items-center sticky top-0">
                <h3 className="text-lg font-medium">
                  Order Details (#{currentOrder._id.substring(currentOrder._id.length - 6).toUpperCase()})
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-white hover:text-gray-200"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                {/* Order Info */}
                <div>
                  <h4 className="text-lg font-medium mb-3">Order Information</h4>
                  <div className="bg-gray-50 p-4 rounded">
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="text-sm font-medium text-gray-500">Order ID:</div>
                      <div className="text-sm text-gray-900">{currentOrder._id}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="text-sm font-medium text-gray-500">Date Placed:</div>
                      <div className="text-sm text-gray-900">
                        {new Date(currentOrder.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="text-sm font-medium text-gray-500">Total Amount:</div>
                      <div className="text-sm text-gray-900">${currentOrder.totalPrice.toFixed(2)}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="text-sm font-medium text-gray-500">Payment Status:</div>
                      <div className="text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          currentOrder.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {currentOrder.isPaid ? 'Paid' : 'Not Paid'}
                        </span>
                      </div>
                    </div>
                    {currentOrder.isPaid && (
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="text-sm font-medium text-gray-500">Paid At:</div>
                        <div className="text-sm text-gray-900">
                          {new Date(currentOrder.paidAt).toLocaleString()}
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="text-sm font-medium text-gray-500">Delivery Status:</div>
                      <div className="text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          currentOrder.isDelivered ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {currentOrder.isDelivered ? 'Delivered' : 'Not Delivered'}
                        </span>
                      </div>
                    </div>
                    {currentOrder.isDelivered && (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm font-medium text-gray-500">Delivered At:</div>
                        <div className="text-sm text-gray-900">
                          {new Date(currentOrder.deliveredAt).toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Customer Info */}
                <div>
                  <h4 className="text-lg font-medium mb-3">Customer Information</h4>
                  <div className="bg-gray-50 p-4 rounded">
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="text-sm font-medium text-gray-500">Name:</div>
                      <div className="text-sm text-gray-900">
                        {currentOrder.user?.name || 'N/A'}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="text-sm font-medium text-gray-500">Email:</div>
                      <div className="text-sm text-gray-900">
                        {currentOrder.user?.email || 'N/A'}
                      </div>
                    </div>
                    
                    <h5 className="text-sm font-medium text-gray-700 mb-2 mt-4">Shipping Address:</h5>
                    <div className="text-sm text-gray-900">
                      <p>{currentOrder.shippingAddress.street}</p>
                      <p>
                        {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state}{' '}
                        {currentOrder.shippingAddress.postalCode}
                      </p>
                      <p>{currentOrder.shippingAddress.country}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Order Items */}
              <div className="px-6 pb-6">
                <h4 className="text-lg font-medium mb-3">Order Items</h4>
                <div className="border rounded overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentOrder.orderItems.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <img
                                  className="h-10 w-10 object-cover rounded-md"
                                  src={item.image}
                                  alt={item.name}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {item.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${item.price.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${(item.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6 border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Order Summary</span>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Subtotal:</span>
                      <span className="text-sm font-medium">
                        ${(currentOrder.totalPrice - currentOrder.taxPrice - currentOrder.shippingPrice).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Shipping:</span>
                      <span className="text-sm font-medium">
                        ${currentOrder.shippingPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Tax:</span>
                      <span className="text-sm font-medium">
                        ${currentOrder.taxPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2 mt-2">
                      <span className="font-medium">Total:</span>
                      <span className="font-bold">
                        ${currentOrder.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="px-6 pb-6 flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={handleCloseModal}
                >
                  Close
                </Button>
                
                {!currentOrder.isDelivered && currentOrder.isPaid && (
                  <Button
                    variant="primary"
                    onClick={() => handleMarkAsDelivered(currentOrder._id)}
                    className="flex items-center"
                    icon={<FiTruck className="mr-1" />}
                  >
                    Mark as Delivered
                  </Button>
                )}
                
                <Button
                  variant="danger"
                  onClick={() => handleDeleteOrder(currentOrder._id)}
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  Delete Order
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Orders;