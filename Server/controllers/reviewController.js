const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc    Get all reviews for a product
// @route   GET /api/reviews/product/:id
// @access  Public
const getProductReviews = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  
  res.json(product.reviews);
});

// @desc    Create a new review
// @route   POST /api/reviews/product/:id
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  
  if (!rating || !comment) {
    res.status(400);
    throw new Error('Please provide rating and comment');
  }
  
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  
  // Check if user already reviewed this product
  const alreadyReviewed = product.reviews.find(
    review => review.user.toString() === req.user._id.toString()
  );
  
  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Product already reviewed');
  }
  
  // Create new review
  const review = {
    name: req.user.name,
    rating: Number(rating),
    comment,
    user: req.user._id
  };
  
  // Add review to product
  product.reviews.push(review);
  
  // Recalculate product rating
  product.calculateAverageRating();
  
  // Save product with new review
  await product.save();
  
  res.status(201).json({ message: 'Review added' });
});

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  
  if (!rating || !comment) {
    res.status(400);
    throw new Error('Please provide rating and comment');
  }
  
  // Find all products to check for the review
  const products = await Product.find({ 'reviews._id': req.params.id });
  
  if (products.length === 0) {
    res.status(404);
    throw new Error('Review not found');
  }
  
  const product = products[0];
  
  // Find the review
  const review = product.reviews.id(req.params.id);
  
  // Check if user is the owner of the review
  if (review.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this review');
  }
  
  // Update review
  review.rating = Number(rating);
  review.comment = comment;
  
  // Recalculate product rating
  product.calculateAverageRating();
  
  // Save product with updated review
  await product.save();
  
  res.json({ message: 'Review updated' });
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
  // Find all products to check for the review
  const products = await Product.find({ 'reviews._id': req.params.id });
  
  if (products.length === 0) {
    res.status(404);
    throw new Error('Review not found');
  }
  
  const product = products[0];
  
  // Find the review
  const review = product.reviews.id(req.params.id);
  
  // Check if user is the owner of the review
  if (review.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(401);
    throw new Error('Not authorized to delete this review');
  }
  
  // Remove review
  review.remove();
  
  // Recalculate product rating
  product.calculateAverageRating();
  
  // Save product without the review
  await product.save();
  
  res.json({ message: 'Review removed' });
});

module.exports = {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview
};