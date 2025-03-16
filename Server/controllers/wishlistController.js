const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'wishlist',
    select: 'name price images category discount countInStock'
  });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json(user.wishlist);
});

// @desc    Add product to wishlist
// @route   POST /api/wishlist
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    res.status(400);
    throw new Error('Product ID is required');
  }

  // Verify product exists
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const user = await User.findById(req.user._id);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Check if product is already in wishlist
  if (user.wishlist.includes(productId)) {
    res.status(400);
    throw new Error('Product already in wishlist');
  }

  // Add to wishlist
  user.wishlist.push(productId);
  await user.save();
  
  // Get updated wishlist with product details
  const updatedUser = await User.findById(req.user._id).populate({
    path: 'wishlist',
    select: 'name price images category discount countInStock'
  });

  res.status(201).json(updatedUser.wishlist);
});

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:id
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const user = await User.findById(req.user._id);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  // Remove product from wishlist
  user.wishlist = user.wishlist.filter(
    id => id.toString() !== productId
  );
  
  await user.save();
  
  // Get updated wishlist with product details
  const updatedUser = await User.findById(req.user._id).populate({
    path: 'wishlist',
    select: 'name price images category discount countInStock'
  });
  
  res.json(updatedUser.wishlist);
});

// @desc    Clear wishlist
// @route   DELETE /api/wishlist
// @access  Private
const clearWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  // Clear wishlist
  user.wishlist = [];
  await user.save();
  
  res.json([]);
});

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist
};