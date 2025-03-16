const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  
  // Validate input
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }
  
  // Check if user exists
  const userExists = await User.findOne({ email });
  
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }
  
  // Create new user
  const user = await User.create({
    name,
    email,
    password,
  });
  
  if (user) {
    // Generate OTP for verification
    const otp = user.generateOTP();
    await user.save();
    
    // Send OTP via email
    const message = `
      <h1>Email Verification</h1>
      <p>Thank you for registering. Please use the following OTP to verify your account:</p>
      <h2>${otp}</h2>
      <p>OTP is valid for 10 minutes.</p>
    `;
    
    try {
      await sendEmail({
        email: user.email,
        subject: 'Email Verification',
        message,
      });
      
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isVerified: user.isVerified,
        token: generateToken(user._id),
        message: 'Registration successful. Please check your email for verification OTP.',
      });
    } catch (error) {
      user.otp = undefined;
      await user.save();
      
      res.status(500);
      throw new Error('Email could not be sent');
    }
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Verify OTP and activate user account
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  
  // Validate input
  if (!email || !otp) {
    res.status(400);
    throw new Error('Please provide email and OTP');
  }
  
  // Find user by email
  const user = await User.findOne({ email });
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  // Check if OTP exists and is valid
  if (!user.otp || !user.otp.code || !user.otp.expiresAt) {
    res.status(400);
    throw new Error('OTP is not valid or has expired');
  }
  
  // Check if OTP is expired
  if (user.otp.expiresAt < Date.now()) {
    res.status(400);
    throw new Error('OTP has expired');
  }
  
  // Check if OTP matches
  if (user.otp.code !== otp) {
    res.status(400);
    throw new Error('Invalid OTP');
  }
  
  // Mark user as verified and clear OTP
  user.isVerified = true;
  user.otp = undefined;
  await user.save();
  
  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    isVerified: user.isVerified,
    token: generateToken(user._id),
    message: 'Account verified successfully',
  });
});

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
const resendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;
  
  // Validate input
  if (!email) {
    res.status(400);
    throw new Error('Please provide email');
  }
  
  // Find user by email
  const user = await User.findOne({ email });
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  // Check if user is already verified
  if (user.isVerified) {
    res.status(400);
    throw new Error('User is already verified');
  }
  
  // Generate new OTP
  const otp = user.generateOTP();
  await user.save();
  
  // Send OTP via email
  const message = `
    <h1>Email Verification</h1>
    <p>Please use the following OTP to verify your account:</p>
    <h2>${otp}</h2>
    <p>OTP is valid for 10 minutes.</p>
  `;
  
  try {
    await sendEmail({
      email: user.email,
      subject: 'Email Verification',
      message,
    });
    
    res.status(200).json({
      message: 'OTP sent successfully',
    });
  } catch (error) {
    user.otp = undefined;
    await user.save();
    
    res.status(500);
    throw new Error('Email could not be sent');
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  // Validate input
  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }
  
  // Find user by email
  const user = await User.findOne({ email }).select('+password');
  
  if (!user) {
    res.status(401);
    throw new Error('Invalid credentials');
  }
  
  // Check if password matches
  const isMatch = await user.matchPassword(password);
  
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid credentials');
  }
  
  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    isVerified: user.isVerified,
    token: generateToken(user._id),
  });
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    isAdmin: user.isAdmin,
    isVerified: user.isVerified,
    addresses: user.addresses,
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  // Update fields
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.phone = req.body.phone || user.phone;
  
  if (req.body.password) {
    user.password = req.body.password;
  }
  
  const updatedUser = await user.save();
  
  res.status(200).json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    phone: updatedUser.phone,
    isAdmin: updatedUser.isAdmin,
    isVerified: updatedUser.isVerified,
    token: generateToken(updatedUser._id),
  });
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  
  const user = await User.findOne({ email });
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  // Generate OTP for password reset
  const otp = user.generateOTP();
  await user.save();
  
  // Send OTP via email
  const message = `
    <h1>Password Reset</h1>
    <p>You have requested a password reset. Please use the following OTP to reset your password:</p>
    <h2>${otp}</h2>
    <p>OTP is valid for 10 minutes.</p>
    <p>If you did not request this, please ignore this email.</p>
  `;
  
  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset',
      message,
    });
    
    res.status(200).json({
      message: 'OTP sent successfully',
    });
  } catch (error) {
    user.otp = undefined;
    await user.save();
    
    res.status(500);
    throw new Error('Email could not be sent');
  }
});

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, password } = req.body;
  
  // Validate input
  if (!email || !otp || !password) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }
  
  const user = await User.findOne({ email });
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  // Check if OTP exists and is valid
  if (!user.otp || !user.otp.code || !user.otp.expiresAt) {
    res.status(400);
    throw new Error('OTP is not valid or has expired');
  }
  
  // Check if OTP is expired
  if (user.otp.expiresAt < Date.now()) {
    res.status(400);
    throw new Error('OTP has expired');
  }
  
  // Check if OTP matches
  if (user.otp.code !== otp) {
    res.status(400);
    throw new Error('Invalid OTP');
  }
  
  // Update password and clear OTP
  user.password = password;
  user.otp = undefined;
  await user.save();
  
  res.status(200).json({
    message: 'Password reset successful',
  });
});

module.exports = {
  registerUser,
  verifyOTP,
  resendOTP,
  loginUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword,
};