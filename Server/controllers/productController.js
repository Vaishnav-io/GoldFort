const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 12;
  const page = Number(req.query.page) || 1;
  
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};
  
  const category = req.query.category ? { category: req.query.category } : {};
  const material = req.query.material ? { material: req.query.material } : {};
  
  const minPrice = req.query.minPrice ? { price: { $gte: Number(req.query.minPrice) } } : {};
  const maxPrice = req.query.maxPrice ? { price: { $lte: Number(req.query.maxPrice) } } : {};
  
  const count = await Product.countDocuments({
    ...keyword,
    ...category,
    ...material,
    ...minPrice,
    ...maxPrice,
  });
  
  const products = await Product.find({
    ...keyword,
    ...category,
    ...material,
    ...minPrice,
    ...maxPrice,
  })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  
  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc    Get top products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(5);
  res.json(products);
});

// @desc    Get top selling products
// @route   GET /api/products/top-selling
// @access  Public
const getTopSellingProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ sold: -1 }).limit(8);
  res.json(products);
});

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    category,
    material,
    weight,
    dimensions,
    images,
    countInStock,
    discount,
    tags,
  } = req.body;
  
  const product = new Product({
    name,
    description,
    price,
    category,
    material,
    weight,
    dimensions,
    images,
    countInStock,
    discount,
    tags,
  });
  
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    category,
    material,
    weight,
    dimensions,
    images,
    countInStock,
    discount,
    tags,
    featured,
    isNew,
  } = req.body;
  
  const product = await Product.findById(req.params.id);
  
  if (product) {
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.material = material || product.material;
    product.weight = weight || product.weight;
    product.dimensions = dimensions || product.dimensions;
    product.images = images || product.images;
    product.countInStock = countInStock || product.countInStock;
    product.discount = discount !== undefined ? discount : product.discount;
    product.tags = tags || product.tags;
    product.featured = featured !== undefined ? featured : product.featured;
    product.isNew = isNew !== undefined ? isNew : product.isNew;
    
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (product) {
    await product.remove();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  
  const product = await Product.findById(req.params.id);
  
  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    
    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }
    
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };
    
    product.reviews.push(review);
    
    // Calculate average rating
    product.calculateAverageRating();
    
    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
const searchProducts = asyncHandler(async (req, res) => {
  const term = req.query.term;
  
  if (!term) {
    res.status(400);
    throw new Error('Search term is required');
  }
  
  const products = await Product.find({
    $or: [
      { name: { $regex: term, $options: 'i' } },
      { category: { $regex: term, $options: 'i' } },
      { description: { $regex: term, $options: 'i' } },
      { tags: { $in: [new RegExp(term, 'i')] } },
    ],
  });
  
  res.json(products);
});

module.exports = {
  getProducts,
  getTopProducts,
  getTopSellingProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  searchProducts,
};