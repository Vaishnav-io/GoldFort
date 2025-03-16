import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiX, FiPlus, FiMinus, FiTrash2, FiArrowRight } from 'react-icons/fi';
import { getCart, updateCartItem, removeFromCart, clearCart } from '../../features/cart/cartSlice';
import Button from '../../components/comms/Button';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalItems, totalAmount, isLoading } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth);
  
  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);
  
  const handleQuantityChange = (productId, quantity, countInStock) => {
    const newQuantity = Math.min(Math.max(1, quantity), countInStock);
    dispatch(updateCartItem({ productId, quantity: newQuantity }));
  };
  
  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
  };
  
  const handleClearCart = () => {
    dispatch(clearCart());
  };
  
  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
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
  
  const emptyCartVariants = {
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
          Shopping Cart
        </motion.h1>
        
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : items.length === 0 ? (
          <motion.div
            className="bg-white rounded-lg shadow-md p-8 text-center max-w-lg mx-auto"
            variants={emptyCartVariants}
            initial="hidden"
            animate="visible"
          >
            <FiShoppingCart className="text-6xl text-indigo-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link to="/products">
              <Button variant="primary">
                Continue Shopping
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <motion.div 
              className="lg:w-2/3 bg-white rounded-lg shadow-md overflow-hidden"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">
                    Your Items ({totalItems})
                  </h2>
                  <button
                    onClick={handleClearCart}
                    className="text-red-500 flex items-center hover:text-red-700 transition-colors"
                  >
                    <FiX className="mr-1" /> Clear Cart
                  </button>
                </div>
              </div>
              
              <div className="divide-y">
                <AnimatePresence>
                  {items.map((item) => {
                    const discountedPrice = item.discount 
                      ? item.price * (1 - item.discount / 100) 
                      : item.price;
                    
                    return (
                      <motion.div
                        key={item.productId}
                        className="p-6 flex flex-col sm:flex-row gap-4"
                        variants={itemVariants}
                        exit="exit"
                        layout
                      >
                        <div className="sm:w-24 h-24">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        
                        <div className="flex-grow">
                          <Link to={`/product/${item.productId}`} className="text-lg font-medium hover:text-indigo-600 transition-colors">
                            {item.name}
                          </Link>
                          
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
                            <div className="flex items-center">
                              <span className="text-gray-600 mr-2">Qty:</span>
                              <div className="flex items-center border rounded">
                                <button
                                  onClick={() => handleQuantityChange(item.productId, item.quantity - 1, item.countInStock)}
                                  disabled={item.quantity <= 1}
                                  className="p-1 px-2 hover:bg-gray-100 disabled:opacity-50"
                                >
                                  <FiMinus />
                                </button>
                                <span className="px-2">{item.quantity}</span>
                                <button
                                  onClick={() => handleQuantityChange(item.productId, item.quantity + 1, item.countInStock)}
                                  disabled={item.quantity >= item.countInStock}
                                  className="p-1 px-2 hover:bg-gray-100 disabled:opacity-50"
                                >
                                  <FiPlus />
                                </button>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {item.discount > 0 && (
                                <span className="text-sm text-gray-500 line-through">
                                  ${item.price.toFixed(2)}
                                </span>
                              )}
                              <span className="font-medium">
                                ${discountedPrice.toFixed(2)}
                              </span>
                            </div>
                            
                            {item.discount > 0 && (
                              <span className="inline-block bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded">
                                {item.discount}% OFF
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex sm:flex-col justify-between sm:justify-start items-end">
                          <span className="font-bold text-lg">
                            ${(discountedPrice * item.quantity).toFixed(2)}
                          </span>
                          
                          <motion.button
                            onClick={() => handleRemoveItem(item.productId)}
                            className="text-gray-500 hover:text-red-500"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FiTrash2 className="text-xl" />
                          </motion.button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </motion.div>
            
            {/* Order Summary */}
            <motion.div 
              className="lg:w-1/3 bg-white rounded-lg shadow-md overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">Order Summary</h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-500">Free</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes</span>
                  <span>${(totalAmount * 0.1).toFixed(2)}</span>
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${(totalAmount + totalAmount * 0.1).toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Including VAT/Sales tax
                  </p>
                </div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleCheckout}
                    variant="primary"
                    fullWidth
                    className="py-3 mt-4"
                    icon={<FiArrowRight />}
                  >
                    Proceed to Checkout
                  </Button>
                </motion.div>
                
                <div className="mt-4">
                  <Link to="/products" className="text-indigo-600 hover:text-indigo-800 flex items-center justify-center">
                    <span>Continue Shopping</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;