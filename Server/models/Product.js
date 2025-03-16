const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a product description'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a product price'],
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    category: {
      type: String,
      required: [true, 'Please add a product category'],
      enum: ['necklace', 'bracelet', 'earring', 'ring', 'pendant', 'watch', 'other'],
    },
    material: {
      type: String,
      enum: ['gold', 'silver', 'platinum', 'diamond', 'other'],
    },
    weight: {
      type: Number,
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    countInStock: {
      type: Number,
      required: [true, 'Please add stock count'],
      default: 0,
    },
    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isNew: {
      type: Boolean,
      default: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    tags: [String],
  },
  {
    timestamps: true,
  }
);

// Calculate average rating whenever a review is added or removed
productSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.numReviews = 0;
    return;
  }
  
  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.rating = (totalRating / this.reviews.length).toFixed(1);
  this.numReviews = this.reviews.length;
};

module.exports = mongoose.model('Product', productSchema);