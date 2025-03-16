import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiInstagram, FiTwitter, FiYoutube } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-4">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Company Info */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bold mb-4">GemElegance</h3>
            <p className="text-gray-400 mb-4">
              Exquisite jewelry for every occasion. Handcrafted with love and passion.
            </p>
            <div className="flex space-x-4 mt-6">
              <motion.a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiFacebook className="text-xl" />
              </motion.a>
              <motion.a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiInstagram className="text-xl" />
              </motion.a>
              <motion.a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiTwitter className="text-xl" />
              </motion.a>
              <motion.a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiYoutube className="text-xl" />
              </motion.a>
            </div>
          </motion.div>
          
          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors inline-block">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-white transition-colors inline-block">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors inline-block">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors inline-block">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-white transition-colors inline-block">
                  Blog
                </Link>
              </li>
            </ul>
          </motion.div>
          
          {/* Categories */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products?category=necklace" className="text-gray-400 hover:text-white transition-colors inline-block">
                  Necklaces
                </Link>
              </li>
              <li>
                <Link to="/products?category=bracelet" className="text-gray-400 hover:text-white transition-colors inline-block">
                  Bracelets
                </Link>
              </li>
              <li>
                <Link to="/products?category=earring" className="text-gray-400 hover:text-white transition-colors inline-block">
                  Earrings
                </Link>
              </li>
              <li>
                <Link to="/products?category=ring" className="text-gray-400 hover:text-white transition-colors inline-block">
                  Rings
                </Link>
              </li>
              <li>
                <Link to="/products?category=watch" className="text-gray-400 hover:text-white transition-colors inline-block">
                  Watches
                </Link>
              </li>
            </ul>
          </motion.div>
          
          {/* Contact Info */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <FiMapPin className="text-gray-400 mr-3 mt-1" />
                <span className="text-gray-400">
                  123 Jewelry Lane<br />
                  New York, NY 10001
                </span>
              </li>
              <li className="flex items-center">
                <FiPhone className="text-gray-400 mr-3" />
                <a href="tel:+12345678901" className="text-gray-400 hover:text-white transition-colors">
                  +1 (234) 567-8901
                </a>
              </li>
              <li className="flex items-center">
                <FiMail className="text-gray-400 mr-3" />
                <a href="mailto:info@gemelegance.com" className="text-gray-400 hover:text-white transition-colors">
                  info@gemelegance.com
                </a>
              </li>
            </ul>
          </motion.div>
        </motion.div>
        
        {/* Newsletter */}
        <motion.div 
          className="border-t border-gray-800 mt-12 pt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-xl font-bold mb-4">Subscribe to Our Newsletter</h3>
            <p className="text-gray-400 mb-6">
              Stay updated with our latest collections and exclusive offers.
            </p>
            <form className="flex flex-col md:flex-row gap-4">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
              <motion.button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Subscribe
              </motion.button>
            </form>
          </div>
        </motion.div>
        
        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>
            &copy; {currentYear} GemElegance. All rights reserved.
          </p>
          <div className="mt-2 flex justify-center space-x-4 text-sm">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link to="/shipping-policy" className="hover:text-white transition-colors">
              Shipping Policy
            </Link>
            <Link to="/refund-policy" className="hover:text-white transition-colors">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;