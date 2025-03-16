const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin !== undefined ? req.body.isAdmin : user.isAdmin;
    
    const updatedUser = await user.save();
    
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (user) {
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      phone: user.phone,
      addresses: user.addresses,
      isVerified: user.isVerified,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    
    if (req.body.password) {
      user.password = req.body.password;
    }
    
    const updatedUser = await user.save();
    
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      isAdmin: updatedUser.isAdmin,
      isVerified: updatedUser.isVerified,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Add a new address to user profile
// @route   POST /api/users/address
// @access  Private
const addUserAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  const { street, city, state, postalCode, country, default: isDefault } = req.body;
  
  if (!street || !city || !state || !postalCode || !country) {
    res.status(400);
    throw new Error('Please provide all address fields');
  }
  
  const newAddress = {
    street,
    city,
    state,
    postalCode,
    country,
    default: isDefault || false
  };
  
  // If this is the default address, set all others to non-default
  if (newAddress.default) {
    user.addresses.forEach(addr => {
      addr.default = false;
    });
  }
  
  // If this is the first address, make it default
  if (user.addresses.length === 0) {
    newAddress.default = true;
  }
  
  user.addresses.push(newAddress);
  await user.save();
  
  res.status(201).json(user.addresses);
});

// @desc    Update an address
// @route   PUT /api/users/address/:id
// @access  Private
const updateUserAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  const address = user.addresses.id(req.params.id);
  
  if (!address) {
    res.status(404);
    throw new Error('Address not found');
  }
  
  const { street, city, state, postalCode, country, default: isDefault } = req.body;
  
  address.street = street || address.street;
  address.city = city || address.city;
  address.state = state || address.state;
  address.postalCode = postalCode || address.postalCode;
  address.country = country || address.country;
  
  // Handle default flag
  if (isDefault) {
    user.addresses.forEach(addr => {
      if (addr._id.toString() !== address._id.toString()) {
        addr.default = false;
      }
    });
    address.default = true;
  }
  
  await user.save();
  
  res.json(user.addresses);
});

// @desc    Delete an address
// @route   DELETE /api/users/address/:id
// @access  Private
const deleteUserAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  const address = user.addresses.id(req.params.id);
  
  if (!address) {
    res.status(404);
    throw new Error('Address not found');
  }
  
  // If removing the default address, make another one default if available
  const wasDefault = address.default;
  
  // Remove the address
  user.addresses.pull(req.params.id);
  
  // If the removed address was default and there are other addresses
  if (wasDefault && user.addresses.length > 0) {
    user.addresses[0].default = true;
  }
  
  await user.save();
  
  res.json(user.addresses);
});

// @desc    Set an address as default
// @route   PUT /api/users/address/:id/default
// @access  Private
const setDefaultAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  const address = user.addresses.id(req.params.id);
  
  if (!address) {
    res.status(404);
    throw new Error('Address not found');
  }
  
  // Set all addresses to non-default
  user.addresses.forEach(addr => {
    addr.default = false;
  });
  
  // Set the specified address as default
  address.default = true;
  
  await user.save();
  
  res.json(user.addresses);
});

module.exports = {
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
};