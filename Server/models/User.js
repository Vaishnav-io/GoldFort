const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false,
    },
    phone: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    addresses: [
      {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
        default: {
          type: Boolean,
          default: false,
        },
      },
    ],
    otp: {
      code: String,
      expiresAt: Date,
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash OTP
userSchema.methods.generateOTP = function () {
  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Set OTP expire (10 minutes)
  const otpExpire = Date.now() + 10 * 60 * 1000;
  
  this.otp = {
    code: otp,
    expiresAt: otpExpire,
  };
  
  return otp;
};

// Generate and hash password reset token
userSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// Set one address as default and others as non-default
userSchema.pre('save', function (next) {
  if (this.isModified('addresses')) {
    const defaultAddressIndex = this.addresses.findIndex(addr => addr.default);
    
    if (defaultAddressIndex !== -1) {
      // If a default address is found, ensure other addresses are not default
      this.addresses.forEach((addr, index) => {
        if (index !== defaultAddressIndex) {
          addr.default = false;
        }
      });
    } else if (this.addresses.length > 0) {
      // If no default address is found, set the first one as default
      this.addresses[0].default = true;
    }
  }
  
  next();
});

module.exports = mongoose.model('User', userSchema);