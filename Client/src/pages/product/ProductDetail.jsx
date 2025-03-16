import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiStar, FiChevronLeft, FiChevronRight, FiUser, FiCalendar, FiMinus, FiPlus } from 'react-icons/fi';
import { getProductById, createProductReview } from '../../features/product/productSlice';
import { addToCart } from '../../features/cart/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../features/wishlist/wishlistSlice';
import Button from '../../components/comms/Button';
import ProductCard from '../../components/comms/ProductCard';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, isLoading, error } = useSelector(state => state.product);
  const { user } = useSelector(state => state.auth);
  const { items: wishlistItems } = useSelector(state => state.wishlist);
  
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  
  const inWishlist = wishlistItems.some(item => 
    item === product?._id || item.productId === product?._id
  );
  
  useEffect(() => {
    dispatch(getProductById(id));
  }, [dispatch, id]);
  
  useEffect(() => {
    // Reset state when product changes
    if (product) {
      setActiveImage(0);
      setQuantity(1);
      setReviewSubmitted(false);
    }
  }, [product]);
  
  const handleAddToCart = () => {
    dispatch(addToCart({
      productId: product._id,
      name: product.name,
      price: product.price * (1 - product.discount / 100),
      image: product.images[0],
      quantity,
      countInStock: product.countInStock,
      discount: product.discount,
    }));
  };
  
  const handleToggleWishlist = () => {
    if (inWishlist) {
      dispatch(removeFromWishlist(product._id));
    } else {
      dispatch(addToWishlist(product._id));
    }
  };
  
  const handleQuantityChange = (newQuantity) => {
    setQuantity(Math.max(1, Math.min(newQuantity, product.countInStock)));
  };
  
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    
    if (rating && comment) {
      dispatch(createProductReview({
        productId: product._id,
        reviewData: {
          rating,
          comment,
        },
      }));
      
      setRating(5);
      setComment('');
      setReviewSubmitted(true);
    }
  };
  
  const nextImage = () => {
    setActiveImage((prev) => (prev + 1) % product.images.length);
  };
  
  const prevImage = () => {
    setActiveImage((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };
  
  // Animation variants
  const imageVariants = {
    enter: (direction) => {
      return {
        x: direction > 0 ? 500 : -500,
        opacity: 0,
      };
    },
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => {
      return {
        x: direction < 0 ? 500 : -500,
        opacity: 0,
      };
    },
  };
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  // Custom swipe detection
  const [[page, direction], setPage] = useState([0, 0]);
  
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };
  
  const paginate = (newDirection) => {
    if (newDirection > 0) {
      nextImage();
    } else {
      prevImage();
    }
    setPage([page + newDirection, newDirection]);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Oops! Product Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/products">
            <Button variant="primary">
              Return to Shop
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="flex items-center mb-8 text-sm text-gray-600">
          <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-indigo-600 transition-colors">Shop</Link>
          <span className="mx-2">/</span>
          <Link to={`/products?category=${product.category}`} className="hover:text-indigo-600 transition-colors capitalize">
            {product.category}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800 font-medium truncate">{product.name}</span>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-12 mb-16">
          {/* Product Images */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden relative">
              <div className="relative h-96 sm:h-[500px] overflow-hidden">
                <AnimatePresence initial={false} custom={direction}>
                  <motion.img
                    key={activeImage}
                    src={product.images[activeImage]}
                    alt={product.name}
                    className="absolute w-full h-full object-contain"
                    custom={direction}
                    variants={imageVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 }
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={(e, { offset, velocity }) => {
                      const swipe = swipePower(offset.x, velocity.x);
                      
                      if (swipe < -swipeConfidenceThreshold) {
                        paginate(1);
                      } else if (swipe > swipeConfidenceThreshold) {
                        paginate(-1);
                      }
                    }}
                  />
                </AnimatePresence>
                
                {/* Navigation Arrows */}
                {product.images.length > 1 && (
                  <>
                    <motion.button
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10"
                      onClick={prevImage}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FiChevronLeft className="text-xl" />
                    </motion.button>
                    <motion.button
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10"
                      onClick={nextImage}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FiChevronRight className="text-xl" />
                    </motion.button>
                  </>
                )}
              </div>
              
              {/* Thumbnail Navigation */}
              {product.images.length > 1 && (
                <div className="flex mt-4 p-4 gap-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <motion.button
                      key={index}
                      className={`w-16 h-16 rounded-md overflow-hidden flex-shrink-0 ${
                        activeImage === index ? 'ring-2 ring-indigo-600' : ''
                      }`}
                      onClick={() => setActiveImage(index)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <img
                        src={image}
                        alt={`${product.name} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Product Info */}
          <motion.div
            className="lg:w-1/2"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1 
              className="text-3xl font-bold mb-4"
              variants={fadeInUp}
            >
              {product.name}
            </motion.h1>
            
            <motion.div 
              className="flex items-center gap-2 mb-4"
              variants={fadeInUp}
            >
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600">({product.numReviews} reviews)</span>
            </motion.div>
            
            <motion.div 
              className="flex items-center mb-6"
              variants={fadeInUp}
            >
              {product.discount > 0 ? (
                <>
                  <span className="text-3xl font-bold text-gray-800">
                    ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                  </span>
                  <span className="ml-3 text-lg text-gray-500 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="ml-3 bg-red-100 text-red-800 text-sm font-medium px-2 py-0.5 rounded">
                    {product.discount}% OFF
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-gray-800">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </motion.div>
            
            <motion.div 
              className="border-t border-b py-6 mb-6"
              variants={fadeInUp}
            >
              <div className="text-gray-800 leading-relaxed mb-6">
                {product.description}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-600">Category:</span>
                  <span className="ml-2 capitalize">{product.category}</span>
                </div>
                {product.material && (
                  <div>
                    <span className="text-gray-600">Material:</span>
                    <span className="ml-2 capitalize">{product.material}</span>
                  </div>
                )}
                <div>
                  <span className="text-gray-600">Availability:</span>
                  <span className={`ml-2 ${product.countInStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.countInStock > 0 
                      ? `In Stock (${product.countInStock} items)` 
                      : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="mb-8"
              variants={fadeInUp}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-32">
                  <label htmlFor="quantity" className="block text-gray-700 mb-1">
                    Quantity
                  </label>
                  <div className="flex items-center border rounded-md">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="p-2 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <FiMinus />
                    </button>
                    <input
                      id="quantity"
                      type="number"
                      min="1"
                      max={product.countInStock}
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                      className="w-12 text-center p-2 border-x focus:outline-none"
                    />
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= product.countInStock}
                      className="p-2 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <FiPlus />
                    </button>
                  </div>
                </div>
                
                <Button
                  onClick={handleAddToCart}
                  disabled={product.countInStock === 0}
                  variant="primary"
                  className="flex-grow py-3"
                  icon={<FiShoppingCart />}
                >
                  {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
                
                <motion.button
                  onClick={handleToggleWishlist}
                  className={`p-3 rounded-full border ${
                    inWishlist
                      ? 'text-red-500 border-red-500'
                      : 'text-gray-400 border-gray-300 hover:border-gray-400'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiHeart className={inWishlist ? 'fill-current' : ''} />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Product Tabs (Details, Reviews, etc.) */}
        <div className="mb-16">
          <div className="border-b mb-8">
            <div className="flex flex-wrap -mb-px">
              <button className="inline-block py-4 px-6 text-indigo-600 border-b-2 border-indigo-600 font-medium">
                Reviews ({product.reviews.length})
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Reviews List */}
            <div>
              <h3 className="text-xl font-bold mb-6">Customer Reviews</h3>
              
              {product.reviews.length === 0 ? (
                <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
              ) : (
                <div className="space-y-6">
                  {product.reviews.map((review) => (
                    <div key={review._id} className="bg-white rounded-lg p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="bg-indigo-100 rounded-full p-2">
                            <FiUser className="text-indigo-600" />
                          </div>
                          <span className="font-medium">{review.name}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <FiCalendar className="mr-1" />
                          <span>
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex mb-2">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            className={`${
                              i < review.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Add Review Form */}
            <div>
              <h3 className="text-xl font-bold mb-6">Add a Review</h3>
              
              {!user ? (
                <div className="bg-gray-100 rounded-lg p-6">
                  <p className="text-gray-700 mb-4">
                    Please <Link to="/login" className="text-indigo-600 font-medium">log in</Link> to leave a review.
                  </p>
                </div>
              ) : reviewSubmitted ? (
                <div className="bg-green-100 text-green-800 rounded-lg p-6">
                  <p className="font-medium">Thank you for your review!</p>
                  <p className="mt-2">Your feedback has been submitted successfully.</p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`text-2xl ${
                            star <= rating
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="comment" className="block text-gray-700 mb-2">
                      Your Review
                    </label>
                    <textarea
                      id="comment"
                      rows="4"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Share your thoughts about this product..."
                      required
                    ></textarea>
                  </div>
                  
                  <Button type="submit" variant="primary">
                    Submit Review
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        <div>
          <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
          
          {/* This would be populated with actual related products from your API */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Sample related products - in a real app these would be fetched from backend */}
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="animate-pulse">
                <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;