import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGrid, FiList, FiSearch, FiFilter } from 'react-icons/fi';
import { getProducts, searchProducts, setFilters, applyFilters } from '../../features/product/productSlice';
import ProductCard from '../../components/comms/ProductCard';
import ProductFilter from '../../components/product/ProductFilter';

const ProductList = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { filteredProducts, isLoading, filters } = useSelector(state => state.product);
  
  const [view, setView] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [sortBy, setSortBy] = useState('default');
  
  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);
  
  useEffect(() => {
    // Handle URL query parameters
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    
    if (category) {
      dispatch(setFilters({ 
        ...filters, 
        category: Array.isArray(filters.category) ? 
          [...filters.category, category] : [category] 
      }));
      dispatch(applyFilters());
    }
  }, [location, dispatch, filters]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      dispatch(searchProducts(searchTerm));
    } else {
      dispatch(applyFilters());
    }
  };
  
  const handleSort = (e) => {
    setSortBy(e.target.value);
  };
  
  // Sort products based on selected option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low-high':
        return a.price - b.price;
      case 'price-high-low':
        return b.price - a.price;
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
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
          Our Jewelry Collection
        </motion.h1>
        
        {/* Search and Filters Top Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <form onSubmit={handleSearch} className="flex-grow flex">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search jewelry..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <button
                type="submit"
                className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Search
              </button>
            </form>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => setView('grid')}
                  className={`p-2 rounded ${view === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                  aria-label="Grid view"
                >
                  <FiGrid />
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`p-2 rounded ${view === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                  aria-label="List view"
                >
                  <FiList />
                </button>
              </div>
              
              <div className="flex-shrink-0">
                <select
                  value={sortBy}
                  onChange={handleSort}
                  className="pl-4 pr-8 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="default">Sort By: Featured</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                  <option value="rating">Best Rating</option>
                </select>
              </div>
              
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="md:hidden p-2 bg-gray-100 rounded-lg"
                aria-label="Toggle filter"
              >
                <FiFilter />
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters - Desktop */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <ProductFilter />
          </div>
          
          {/* Filters - Mobile */}
          <AnimatePresence>
            {showFilter && (
              <motion.div
                className="md:hidden mb-4"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ProductFilter isMobile={true} />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Product Grid/List */}
          <div className="flex-grow">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            ) : sortedProducts.length === 0 ? (
              <motion.div
                className="bg-white rounded-lg shadow-md p-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h2 className="text-2xl font-bold mb-4">No Products Found</h2>
                <p className="text-gray-600">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
              </motion.div>
            ) : (
              <motion.div
                className={`
                  ${view === 'grid' 
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
                    : 'space-y-6'
                  }
                `}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {sortedProducts.map(product => (
                  <motion.div key={product._id} variants={itemVariants} layout>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;