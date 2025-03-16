import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiGift, FiTruck, FiShield } from 'react-icons/fi';
import { getProducts, getTopSelling } from '../features/product/productSlice';
import ProductCard from '../components/comms/ProductCard';
import Button from '../components/comms/Button';
const Home = () => {
  const dispatch = useDispatch();
  const { products, topSelling, isLoading } = useSelector(state => state.product);
  
  useEffect(() => {
    dispatch(getProducts());
    dispatch(getTopSelling());
  }, [dispatch]);
  
  // Featured collections
  const collections = [
    {
      id: 1,
      name: 'Wedding Collection',
      image: 'https://images.unsplash.com/photo-1570439694968-2e7c5c288504',
      description: 'Stunning jewelry for your special day',
      link: '/products?category=wedding'
    },
    {
      id: 2,
      name: 'Vintage Classics',
      image: 'https://images.unsplash.com/photo-1561828995-aa79a2db86dd',
      description: 'Timeless pieces with elegant designs',
      link: '/products?category=vintage'
    },
    {
      id: 3,
      name: 'Modern Minimalist',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f',
      description: 'Clean, contemporary styles for everyday wear',
      link: '/products?category=minimalist'
    }
  ];
  
  // Animation variants
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
  
  const heroImageVariants = {
    hidden: { scale: 1.2, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center">
        <motion.div
          className="absolute inset-0 z-0"
          initial="hidden"
          animate="visible"
          variants={heroImageVariants}
        >
          <img 
            src="https://images.unsplash.com/photo-1611085583191-a3b181a88401" 
            alt="Luxury Jewelry" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40" />
        </motion.div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="max-w-xl text-white"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1 
              className="text-5xl md:text-6xl font-bold mb-4"
              variants={fadeInUp}
            >
              Exquisite Jewelry for Every Occasion
            </motion.h1>
            
            <motion.p 
              className="text-xl mb-8"
              variants={fadeInUp}
            >
              Discover our handcrafted collection of fine jewelry pieces that will make you shine.
            </motion.p>
            
            <motion.div variants={fadeInUp}>
              <Link to="/products">
                <Button
                  variant="primary"
                  className="px-8 py-3 text-lg"
                  icon={<FiArrowRight />}
                >
                  Shop Now
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Featured Collections */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Featured Collections</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our curated collections designed for every style and occasion
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {collections.map((collection) => (
              <motion.div
                key={collection.id}
                className="bg-white rounded-lg overflow-hidden shadow-lg"
                variants={fadeInUp}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <div className="h-64 overflow-hidden">
                  <img 
                    src={collection.image} 
                    alt={collection.name} 
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{collection.name}</h3>
                  <p className="text-gray-600 mb-4">{collection.description}</p>
                  <Link to={collection.link} className="text-indigo-600 font-medium hover:text-indigo-800 inline-flex items-center">
                    Explore Collection <FiArrowRight className="ml-2" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Top Selling Products */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Top Selling Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our customers' favorites that you'll love too
            </p>
          </motion.div>
          
          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              {topSelling.slice(0, 8).map(product => (
                <motion.div key={product._id} variants={fadeInUp}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
          
          <motion.div 
            className="text-center mt-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <Link to="/products">
              <Button variant="outline" className="px-8 py-3">
                View All Products
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-indigo-50">
        <div className="container mx-auto px-6">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div 
              className="bg-white p-8 rounded-lg shadow-md text-center"
              variants={fadeInUp}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <FiTruck className="mx-auto text-4xl text-indigo-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Free Shipping</h3>
              <p className="text-gray-600">On all orders over $100</p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-8 rounded-lg shadow-md text-center"
              variants={fadeInUp}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <FiGift className="mx-auto text-4xl text-indigo-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Special Packaging</h3>
              <p className="text-gray-600">Elegant gift wrapping for your loved ones</p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-8 rounded-lg shadow-md text-center"
              variants={fadeInUp}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <FiShield className="mx-auto text-4xl text-indigo-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Warranty</h3>
              <p className="text-gray-600">1-year warranty on all products</p>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2 
              className="text-3xl font-bold mb-4"
              variants={fadeInUp}
            >
              Subscribe to Our Newsletter
            </motion.h2>
            
            <motion.p 
              className="text-gray-600 mb-8"
              variants={fadeInUp}
            >
              Get updates on new arrivals, special offers, and exclusive discounts
            </motion.p>
            
            <motion.form 
              className="flex flex-col md:flex-row gap-4"
              variants={fadeInUp}
            >
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-grow px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
              <Button type="submit" className="px-6 py-3">
                Subscribe
              </Button>
            </motion.form>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;