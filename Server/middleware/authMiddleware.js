const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// Protect routes
const protect = asyncHandler(async (req, res, next) => {
  let token;
  
  // Check if authorization header exists and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from the token
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }
      
      // Check if user is verified
      if (!user.isVerified) {
        res.status(403);
        throw new Error('Account not verified. Please verify your email to access this resource.');
      }
      
      req.user = user;
      next();
    } catch (error) {
      console.error(error);
        // Check if error is about verification
        if (error.message === 'Account not verified. Please verify your email to access this resource.') {
          res.status(403).json({ 
            message: error.message,
            requiresVerification: true
          });
          return;
        }
        
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }
  
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// Admin middleware
const admin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as an admin');
  }
});

// Verified user middleware
const verified = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.isVerified) {
    next();
  } else {
    res.status(403);
    throw new Error('Account not verified');
  }
});

module.exports = { protect, admin, verified };