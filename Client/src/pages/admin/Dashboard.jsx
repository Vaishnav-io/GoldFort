import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPackage, FiUsers, FiShoppingCart, FiDollarSign, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { getOrders } from '../../features/order/orderSlice';
import { getProducts } from '../../features/product/productSlice';
import { getUsers } from '../../features/user/userSlice';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user } = useSelector((state) => state.auth);
  const { orders } = useSelector((state) => state.order);
  const { products } = useSelector((state) => state.product);
  const { users } = useSelector((state) => state.user);
  
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
  });
  
  // Recent orders and stats calculation
  const [recentOrders, setRecentOrders] = useState([]);
  const [salesData, setSalesData] = useState([]);
  
  useEffect(() => {
    if (user && user.isAdmin) {
      dispatch(getOrders());
      dispatch(getProducts());
      dispatch(getUsers());
    } else {
      navigate('/login');
    }
  }, [dispatch, navigate, user]);
  
  useEffect(() => {
    if (orders && products && users) {
      // Calculate stats
      const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
      const pendingOrders = orders.filter(order => !order.isDelivered).length;
      const lowStockProducts = products.filter(product => product.countInStock < 10).length;
      
      setStats({
        totalSales,
        totalOrders: orders.length,
        totalProducts: products.length,
        totalUsers: users.length,
        pendingOrders,
        lowStockProducts,
      });
      
      // Set recent orders
      const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setRecentOrders(sortedOrders.slice(0, 5));
      
      // Calculate sales data for chart
      const last6Months = [];
      const today = new Date();
      
      for (let i = 5; i >= 0; i--) {
        const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
        last6Months.push({
          month: month.toLocaleString('default', { month: 'short' }),
          year: month.getFullYear(),
          sales: 0,
        });
      }
      
      orders.forEach(order => {
        const orderDate = new Date(order.createdAt);
        const orderMonth = orderDate.toLocaleString('default', { month: 'short' });
        const orderYear = orderDate.getFullYear();
        
        const monthData = last6Months.find(
          m => m.month === orderMonth && m.year === orderYear
        );
        
        if (monthData && order.isPaid) {
          monthData.sales += order.totalPrice;
        }
      });
      
      setSalesData(last6Months);
    }
  }, [orders, products, users]);
  
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
  
  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader title="Dashboard" />
        
        <main className="flex-1 overflow-y-auto p-4">
          <motion.div
            className="max-w-7xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <motion.div
                className="bg-white p-6 rounded-lg shadow-md"
                variants={itemVariants}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Total Sales</p>
                    <h3 className="text-2xl font-bold text-gray-800">${stats.totalSales.toFixed(2)}</h3>
                  </div>
                  <div className="bg-indigo-100 p-3 rounded-full">
                    <FiDollarSign className="h-6 w-6 text-indigo-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-green-500">
                  <FiTrendingUp className="mr-1" />
                  <span>12% increase from last month</span>
                </div>
              </motion.div>
              
              <motion.div
                className="bg-white p-6 rounded-lg shadow-md"
                variants={itemVariants}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Total Orders</p>
                    <h3 className="text-2xl font-bold text-gray-800">{stats.totalOrders}</h3>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-full">
                    <FiShoppingCart className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-orange-500">
                  <span className="font-medium">{stats.pendingOrders} pending</span>
                </div>
              </motion.div>
              
              <motion.div
                className="bg-white p-6 rounded-lg shadow-md"
                variants={itemVariants}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Total Products</p>
                    <h3 className="text-2xl font-bold text-gray-800">{stats.totalProducts}</h3>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <FiPackage className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-red-500">
                  <FiTrendingDown className="mr-1" />
                  <span>{stats.lowStockProducts} low stock items</span>
                </div>
              </motion.div>
              
              <motion.div
                className="bg-white p-6 rounded-lg shadow-md"
                variants={itemVariants}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Total Users</p>
                    <h3 className="text-2xl font-bold text-gray-800">{stats.totalUsers}</h3>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <FiUsers className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-green-500">
                  <FiTrendingUp className="mr-1" />
                  <span>5 new this week</span>
                </div>
              </motion.div>
            </div>
            
            {/* Sales Chart */}
            <motion.div
              className="bg-white p-6 rounded-lg shadow-md mb-8"
              variants={itemVariants}
            >
              <h2 className="text-lg font-medium text-gray-800 mb-4">Sales Overview</h2>
              <div className="h-64">
                {/* This would be replaced with actual chart component */}
                <div className="h-full flex items-end justify-between gap-2">
                  {salesData.map((data, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div 
                        className="bg-indigo-500 w-16 rounded-t-md" 
                        style={{ 
                          height: `${Math.max(10, (data.sales / Math.max(...salesData.map(d => d.sales))) * 180)}px` 
                        }}
                      ></div>
                      <div className="text-xs mt-2 text-gray-600">
                        {data.month}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
            
            {/* Recent Orders */}
            <motion.div
              className="bg-white rounded-lg shadow-md"
              variants={itemVariants}
            >
              <div className="p-6 border-b">
                <h2 className="text-lg font-medium text-gray-800">Recent Orders</h2>
              </div>
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
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order._id.substring(order._id.length - 6).toUpperCase()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.user && order.user.name ? order.user.name : 'N/A'}
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
                                ? 'Completed' 
                                : 'Processing' 
                              : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    
                    {recentOrders.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                          No recent orders found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;