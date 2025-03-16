const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserProfile,
  updateUserProfile,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  setDefaultAddress
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
// Note: Registration and authentication routes are in authRoutes.js

// Protected routes - require authentication
router.use(protect);

// User profile routes
router.route('/profile')
  .get(getUserProfile)
  .put(updateUserProfile);

// User address routes
router.route('/address')
  .post(addUserAddress);

router.route('/address/:id')
  .put(updateUserAddress)
  .delete(deleteUserAddress);

router.put('/address/:id/default', setDefaultAddress);

// Admin only routes
router.route('/')
  .get(admin, getUsers);

router.route('/:id')
  .get(admin, getUserById)
  .put(admin, updateUser)
  .delete(admin, deleteUser);

module.exports = router;