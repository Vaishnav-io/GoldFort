import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi';
import { addToCart } from '../../features/cart/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../features/wishlist/wishlistSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { items: wishlistItems } = useSelector(state => state.wishlist);
  
  const inWishlist = wishlistItems.some(id => id === product._id || id.productId === product._id);
  
  const handleAddToCart = () => {
    dispatch(addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1
    }));
  };
  
  const handleToggleWishlist = () => {
    if (inWishlist) {
      dispatch(removeFromWishlist(product._id));
    } else {
      dispatch(addToWishlist(product._id));
    }
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4, 
        ease: "easeOut" 
      }
    },
    hover: { 
      y: -10,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { type: "spring", stiffness: 400, damping: 17 }
    }
  };
  
  const imageVariants = {
    hover: { scale: 1.05, transition: { duration: 0.3 } }
  };
  
  return (
    <motion.div 
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      layout
    >
      <Link to={`/product/${product._id}`} className="block relative h-64 overflow-hidden">
        <motion.img 
          src={product.images[0]} 
          alt={product.name} 
          className="object-cover object-center w-full h-full transition-transform"
          variants={imageVariants}
        />
        {product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {product.discount}% OFF
          </div>
        )}
      </Link>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-gray-700 font-medium text-xl truncate">
            {product.name}
          </h3>
          <motion.button 
            onClick={handleToggleWishlist}
            className={`p-2 rounded-full ${inWishlist ? 'text-red-500' : 'text-gray-400'}`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiHeart className={inWishlist ? 'fill-current' : ''} />
          </motion.button>
        </div>
        
        <p className="text-gray-500 text-sm mb-2 truncate">{product.category}</p>
        
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <FiStar 
              key={i} 
              className={`${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
            />
          ))}
          <span className="text-gray-600 text-xs ml-1">({product.numReviews})</span>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-end gap-2">
            <span className="text-xl font-bold text-gray-800">${product.price.toFixed(2)}</span>
            {product.discount > 0 && (
              <span className="text-sm text-gray-500 line-through">
                ${(product.price / (1 - product.discount / 100)).toFixed(2)}
              </span>
            )}
          </div>
          
          <motion.button
            onClick={handleAddToCart}
            className="flex items-center justify-center bg-indigo-600 text-white p-2 rounded-full"
            whileHover={{ scale: 1.1, backgroundColor: '#4338ca' }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <FiShoppingCart />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;