const express = require('express');
const router = express.Router();
const {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// Get all reviews for a product
router.get('/product/:id', getProductReviews);

// Protected routes - Require authentication
router.use(protect);

// Create a review
router.post('/product/:id', createReview);

// Update or delete a specific review
router.route('/:id')
  .put(updateReview)
  .delete(deleteReview);

module.exports = router;