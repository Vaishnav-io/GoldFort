const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate({
    path: 'items.product',
    select: 'name price images countInStock discount',
  });
  
  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [],
    });
  }
  
  // Transform cart items to match frontend structure
  const transformedItems = cart.items.map(item => ({
    productId: item.product._id,
    name: item.product.name,
    price: item.product.price,
    image: item.product.images[0],
    countInStock: item.product.countInStock,
    quantity: item.quantity,
    discount: item.product.discount || 0,
  }));
  
  res.json(transformedItems);
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  
  // Validate product
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  
  // Check if product is in stock
  if (product.countInStock < quantity) {
    res.status(400);
    throw new Error('Product is out of stock');
  }
  
  // Find user's cart
  let cart = await Cart.findOne({ user: req.user._id });
  
  // If cart doesn't exist, create a new one
  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [{ product: productId, quantity }],
    });
  } else {
    // Check if product already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );
    
    if (existingItemIndex > -1) {
      // Update quantity if product already exists
      cart.items[existingItemIndex].quantity += quantity;
      
      // Check if updated quantity exceeds stock
      if (cart.items[existingItemIndex].quantity > product.countInStock) {
        cart.items[existingItemIndex].quantity = product.countInStock;
      }
    } else {
      // Add new item if product doesn't exist in cart
      cart.items.push({ product: productId, quantity });
    }
    
    await cart.save();
  }
  
  // Fetch updated cart with product details
  cart = await Cart.findOne({ user: req.user._id }).populate({
    path: 'items.product',
    select: 'name price images countInStock discount',
  });
  
  // Transform cart items to match frontend structure
  const transformedItems = cart.items.map(item => ({
    productId: item.product._id,
    name: item.product.name,
    price: item.product.price,
    image: item.product.images[0],
    countInStock: item.product.countInStock,
    quantity: item.quantity,
    discount: item.product.discount || 0,
  }));
  
  res.status(201).json(transformedItems);
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/:id
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const productId = req.params.id;
  
  // Validate quantity
  if (quantity <= 0) {
    res.status(400);
    throw new Error('Quantity must be greater than 0');
  }
  
  // Validate product
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  
  // Check if product is in stock
  if (product.countInStock < quantity) {
    res.status(400);
    throw new Error('Product is out of stock');
  }
  
  // Find user's cart
  let cart = await Cart.findOne({ user: req.user._id });
  
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }
  
  // Check if product exists in cart
  const existingItemIndex = cart.items.findIndex(
    item => item.product.toString() === productId
  );
  
  if (existingItemIndex === -1) {
    res.status(404);
    throw new Error('Product not found in cart');
  }
  
  // Update quantity
  cart.items[existingItemIndex].quantity = quantity;
  await cart.save();
  
  // Fetch updated cart with product details
  cart = await Cart.findOne({ user: req.user._id }).populate({
    path: 'items.product',
    select: 'name price images countInStock discount',
  });
  
  // Transform cart items to match frontend structure
  const transformedItems = cart.items.map(item => ({
    productId: item.product._id,
    name: item.product.name,
    price: item.product.price,
    image: item.product.images[0],
    countInStock: item.product.countInStock,
    quantity: item.quantity,
    discount: item.product.discount || 0,
  }));
  
  res.json(transformedItems);
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
// @access  Private
const removeFromCart = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  
  // Find user's cart
  let cart = await Cart.findOne({ user: req.user._id });
  
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }
  
  // Filter out the item to remove
  cart.items = cart.items.filter(
    item => item.product.toString() !== productId
  );
  
  await cart.save();
  
  // Fetch updated cart with product details
  cart = await Cart.findOne({ user: req.user._id }).populate({
    path: 'items.product',
    select: 'name price images countInStock discount',
  });
  
  // Transform cart items to match frontend structure
  const transformedItems = cart.items.map(item => ({
    productId: item.product._id,
    name: item.product.name,
    price: item.product.price,
    image: item.product.images[0],
    countInStock: item.product.countInStock,
    quantity: item.quantity,
    discount: item.product.discount || 0,
  }));
  
  res.json(transformedItems);
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
  // Find user's cart
  const cart = await Cart.findOne({ user: req.user._id });
  
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }
  
  // Clear all items
  cart.items = [];
  await cart.save();
  
  res.json([]);
});

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};