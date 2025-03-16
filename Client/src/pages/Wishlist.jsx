import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiTrash2, FiX } from 'react-icons/fi';
import { getWishlist, removeFromWishlist, clearWishlist } from '../features/wishlist/wishlistSlice';
import { addToCart } from '../features/cart/cartSlice';
import { getProducts } from '../features/product/productSlice';
import Button from '../components/comms/Button';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { items, isLoading } = useSelector(state => state.wishlist);
  const { products } = useSelector(state => state.product);
  const [wishlistProducts, setWishlistProducts] = useState([]);
  
  useEffect(() => {
    dispatch(getWishlist());
    dispatch(getProducts());
  }, [dispatch]);
  
  useEffect(() => {
    if (items.length > 0 && products.length > 0) {
      // Match wishlist items with product details
      const wishlistWithDetails = items.map(id => {
        // Handle different formats of wishlist items (string ID or object with productId)
        const productId = typeof id === 'string' ? id : id.productId;
        return products.find(product => product._id === productId);
      }).filter(Boolean); // Filter out undefined items
      
      setWishlistProducts(wishlistWithDetails);
    } else {
      setWishlistProducts([]);
    }
  }, [items, products]);
  
  const handleRemoveFromWishlist = (productId) => {
    dispatch(removeFromWishlist(productId));
  };
  
  const handleClearWishlist = () => {
    dispatch(clearWishlist());
  };
  
  const handleAddToCart = (product) => {
    dispatch(addToCart({
      productId: product._id,
      name: product.name,
      price: product.price * (1 - product.discount / 100),
      image: product.images[0],
      quantity: 1,
      countInStock: product.countInStock,
      discount: product.discount,
    }));
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      x: -100,
      transition: { duration: 0.3 }
    }
  };
  
  const emptyWishlistVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5 }
    }
  };
  
  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4">
        <motion.h1 
          className="text-3xl font-bold mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          My Wishlist
        </motion.h1>
        
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : wishlistProducts.length === 0 ? (
          <motion.div
            className="bg-white rounded-lg shadow-md p-8 text-center max-w-lg mx-auto"
            variants={emptyWishlistVariants}
            initial="hidden"
            animate="visible"
          >
            <FiHeart className="text-6xl text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">Your Wishlist is Empty</h2>
            <p className="text-gray-600 mb-8">
              Save items you love in your wishlist and come back to them later.
            </p>
            <Link to="/products">
              <Button variant="primary">
                Start Shopping
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                Saved Items ({wishlistProducts.length})
              </h2>
              <button
                onClick={handleClearWishlist}
                className="text-red-500 flex items-center hover:text-red-700 transition-colors"
              >
                <FiX className="mr-1" /> Clear All
              </button>
            </div>
            
            <motion.div 
              className="divide-y"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence>
                {wishlistProducts.map((product) => {
                  const discountedPrice = product.discount 
                    ? product.price * (1 - product.discount / 100) 
                    : product.price;
                  
                  return (
                    <motion.div
                      key={product._id}
                      className="p-6 flex flex-col sm:flex-row gap-4"
                      variants={itemVariants}
                      exit="exit"
                      layout
                    >
                      <div className="sm:w-32 h-32">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      
                      <div className="flex-grow">
                        <Link to={`/product/${product._id}`} className="text-lg font-medium hover:text-indigo-600 transition-colors">
                          {product.name}
                        </Link>
                        
                        <div className="mt-2 text-sm text-gray-500 capitalize">
                          {product.category}
                        </div>
                        
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-2">
                            {product.discount > 0 && (
                              <span className="text-sm text-gray-500 line-through">
                                ${product.price.toFixed(2)}
                              </span>
                            )}
                            <span className="font-medium text-gray-900">
                              ${discountedPrice.toFixed(2)}
                            </span>
                          </div>
                          
                          {product.discount > 0 && (
                            <span className="inline-block bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded">
                              {product.discount}% OFF
                            </span>
                          )}
                        </div>
                        
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button 
                            onClick={() => handleAddToCart(product)}
                            disabled={product.countInStock === 0}
                            variant="primary"
                            className="sm:mr-2"
                            icon={<FiShoppingCart className="text-lg" />}
                          >
                            {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                          </Button>
                          
                          <Button
                            onClick={() => handleRemoveFromWishlist(product._id)}
                            variant="outline"
                            icon={<FiTrash2 className="text-lg" />}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                      
                      <div className="sm:flex sm:flex-col sm:justify-center sm:items-end hidden">
                        {product.countInStock > 0 ? (
                          <span className="text-green-600 flex items-center mb-2">
                            <span className="w-2 h-2 rounded-full bg-green-600 mr-1"></span>
                            In Stock
                          </span>
                        ) : (
                          <span className="text-red-600 flex items-center mb-2">
                            <span className="w-2 h-2 rounded-full bg-red-600 mr-1"></span>
                            Out of Stock
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
            
            <div className="p-6 border-t">
              <div className="flex justify-between">
                <Link to="/products">
                  <Button variant="outline">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;