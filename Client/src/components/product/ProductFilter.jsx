import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { FiChevronDown, FiFilter, FiX } from 'react-icons/fi';
import { setFilters, applyFilters, clearFilters } from '../../features/product/productSlice';
import Button from '../comms/Button';

const categories = [
  { id: 'necklace', name: 'Necklaces' },
  { id: 'bracelet', name: 'Bracelets' },
  { id: 'earring', name: 'Earrings' },
  { id: 'ring', name: 'Rings' },
  { id: 'pendant', name: 'Pendants' },
  { id: 'watch', name: 'Watches' },
];

const materials = [
  { id: 'gold', name: 'Gold' },
  { id: 'silver', name: 'Silver' },
  { id: 'platinum', name: 'Platinum' },
  { id: 'diamond', name: 'Diamond' },
];

const ProductFilter = ({ isMobile = false }) => {
  const dispatch = useDispatch();
  const { filters, products } = useSelector(state => state.product);
  
  const [isOpen, setIsOpen] = useState(!isMobile);
  const [localFilters, setLocalFilters] = useState(filters);
  const [priceRange, setPriceRange] = useState(filters.priceRange);
  
  // Calculate min and max price from products
  const minPrice = products.length ? Math.floor(Math.min(...products.map(p => p.price))) : 0;
  const maxPrice = products.length ? Math.ceil(Math.max(...products.map(p => p.price))) : 10000;
  
  useEffect(() => {
    setPriceRange(filters.priceRange);
    setLocalFilters(filters);
  }, [filters]);
  
  const handleCategoryChange = (categoryId) => {
    const currentCategories = [...localFilters.category];
    const index = currentCategories.indexOf(categoryId);
    
    if (index === -1) {
      currentCategories.push(categoryId);
    } else {
      currentCategories.splice(index, 1);
    }
    
    setLocalFilters({
      ...localFilters,
      category: currentCategories
    });
  };
  
  const handlePriceChange = (value) => {
    setPriceRange(value);
  };
  
  const handleApplyFilters = () => {
    dispatch(setFilters({
      ...localFilters,
      priceRange
    }));
    dispatch(applyFilters());
    if (isMobile) setIsOpen(false);
  };
  
  const handleClearFilters = () => {
    dispatch(clearFilters());
    if (isMobile) setIsOpen(false);
  };
  
  const filterVariants = {
    hidden: { opacity: 0, height: 0, overflow: 'hidden' },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  };
  
  const mobileButtonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md">
      {isMobile && (
        <motion.button
          className="w-full flex items-center justify-between px-4 py-3 bg-indigo-600 text-white rounded-lg"
          onClick={() => setIsOpen(!isOpen)}
          variants={mobileButtonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
        >
          <div className="flex items-center gap-2">
            <FiFilter />
            <span>Filters</span>
          </div>
          <FiChevronDown className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </motion.button>
      )}
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={filterVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="p-4"
          >
            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Category</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <div key={category.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`category-${category.id}`}
                      checked={localFilters.category.includes(category.id)}
                      onChange={() => handleCategoryChange(category.id)}
                      className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                    />
                    <label htmlFor={`category-${category.id}`} className="ml-2 text-gray-700">
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Price Range Filter */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Price Range</h3>
              <div className="px-2">
                <Slider
                  range
                  min={minPrice}
                  max={maxPrice}
                  value={priceRange}
                  onChange={handlePriceChange}
                  trackStyle={[{ backgroundColor: '#4f46e5' }]}
                  handleStyle={[
                    { borderColor: '#4f46e5', backgroundColor: '#4f46e5' },
                    { borderColor: '#4f46e5', backgroundColor: '#4f46e5' }
                  ]}
                  railStyle={{ backgroundColor: '#d1d5db' }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-gray-600">${priceRange[0]}</span>
                <span className="text-gray-600">${priceRange[1]}</span>
              </div>
            </div>
            
            {/* Material Filter */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Material</h3>
              <div className="space-y-2">
                {materials.map(material => (
                  <div key={material.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`material-${material.id}`}
                      className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                    />
                    <label htmlFor={`material-${material.id}`} className="ml-2 text-gray-700">
                      {material.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                onClick={handleApplyFilters} 
                fullWidth
              >
                Apply Filters
              </Button>
              <Button 
                onClick={handleClearFilters} 
                variant="outline" 
                fullWidth
              >
                Clear All
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductFilter;