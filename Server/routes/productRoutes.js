const express = require('express');
const router = express.Router();
const {
  getProducts,
  getTopProducts,
  getTopSellingProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  searchProducts,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getProducts);
router.get('/top', getTopProducts);
router.get('/top-selling', getTopSellingProducts);
router.get('/search', searchProducts);
router.get('/:id', getProductById);

// Protected routes
router.post('/:id/reviews', protect, createProductReview);

// Admin routes
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;