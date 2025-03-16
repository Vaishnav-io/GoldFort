const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  deleteOrder
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// Protect all routes
router.use(protect);

// Route to get logged in user's orders and create a new order
router.route('/')
  .post(createOrder)
  .get(getMyOrders);

// Admin only route to get all orders
router.route('/all').get(admin, getOrders);

// Route to get a specific order, update to paid, and update to delivered
router.route('/:id')
  .get(getOrderById)
  .delete(admin, deleteOrder);

// Route to update order to paid
router.route('/:id/pay').put(updateOrderToPaid);

// Route to update order to delivered (admin only)
router.route('/:id/deliver').put(admin, updateOrderToDelivered);

module.exports = router;