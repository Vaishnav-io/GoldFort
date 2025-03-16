const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist
} = require('../controllers/wishlistController');

// Check if controller functions are defined
console.log('Controller functions:', {
  getWishlist: typeof getWishlist,
  addToWishlist: typeof addToWishlist,
  removeFromWishlist: typeof removeFromWishlist,
  clearWishlist: typeof clearWishlist
});

// All routes are protected and require authentication
router.use(protect);

// Get wishlist items and add item to wishlist
router.route('/')
  .get(getWishlist)
  .post(addToWishlist)
  .delete(clearWishlist);

// Remove item from wishlist
router.delete('/:id', removeFromWishlist);

module.exports = router;