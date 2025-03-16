import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiCheck } from 'react-icons/fi';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../features/product/productSlice';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import Button from '../../components/comms/Button';

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { products, isLoading, isError, message } = useSelector((state) => state.product);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    countInStock: '',
    images: [''],
    material: '',
    discount: '0',
  });
  
  useEffect(() => {
    if (user && user.isAdmin) {
      dispatch(getProducts());
    } else {
      navigate('/login');
    }
  }, [dispatch, navigate, user]);
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleOpenModal = (product = null) => {
    if (product) {
      setCurrentProduct(product);
      setFormData({
        name: product.name,
        price: product.price.toString(),
        category: product.category,
        description: product.description,
        countInStock: product.countInStock.toString(),
        images: product.images,
        material: product.material || '',
        discount: product.discount ? product.discount.toString() : '0',
      });
    } else {
      setCurrentProduct(null);
      setFormData({
        name: '',
        price: '',
        category: '',
        description: '',
        countInStock: '',
        images: [''],
        material: '',
        discount: '0',
      });
    }
    setShowModal(true);
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleImageChange = (index, value) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = value;
    setFormData((prev) => ({
      ...prev,
      images: updatedImages,
    }));
  };
  
  const addImageField = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ''],
    }));
  };
  
  const removeImageField = (index) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      images: updatedImages,
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const productData = {
      name: formData.name,
      price: parseFloat(formData.price),
      category: formData.category,
      description: formData.description,
      countInStock: parseInt(formData.countInStock),
      images: formData.images.filter(img => img.trim() !== ''),
      material: formData.material,
      discount: parseInt(formData.discount),
    };
    
    if (currentProduct) {
      dispatch(updateProduct({
        productId: currentProduct._id,
        productData,
      }));
    } else {
      dispatch(createProduct(productData));
    }
    
    setShowModal(false);
  };
  
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(id));
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
      },
    },
  };
  
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader title="Products" />
        
        <main className="flex-1 overflow-y-auto p-4">
          <motion.div
            className="max-w-7xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              variants={itemVariants}
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              <Button
                onClick={() => handleOpenModal()}
                variant="primary"
                className="flex items-center justify-center"
                icon={<FiPlus />}
              >
                Add Product
              </Button>
            </motion.div>
            
            {isError && (
              <motion.div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {message}
              </motion.div>
            )}
            
            <motion.div
              className="bg-white rounded-lg shadow overflow-hidden"
              variants={itemVariants}
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {isLoading ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center">
                          <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500"></div>
                          </div>
                        </td>
                      </tr>
                    ) : filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                          No products found
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((product) => (
                        <tr key={product._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <img
                                  className="h-10 w-10 object-cover rounded-md"
                                  src={product.images[0] || 'https://via.placeholder.com/150'}
                                  alt={product.name}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {product.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                            {product.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${product.price.toFixed(2)}
                            {product.discount > 0 && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                {product.discount}% OFF
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              product.countInStock > 10
                                ? 'bg-green-100 text-green-800'
                                : product.countInStock > 0
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {product.countInStock > 0 ? product.countInStock : 'Out of Stock'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleOpenModal(product)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                <FiEdit2 className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleDelete(product._id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <FiTrash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        </main>
      </div>
      
      {/* Product Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
            ></motion.div>
            
            <motion.div
              className="bg-white rounded-lg overflow-hidden shadow-xl transform w-full max-w-2xl z-10 mx-4"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="px-6 py-4 bg-indigo-600 text-white flex justify-between items-center">
                <h3 className="text-lg font-medium">
                  {currentProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-white hover:text-gray-200"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="necklace">Necklace</option>
                      <option value="bracelet">Bracelet</option>
                      <option value="earring">Earring</option>
                      <option value="ring">Ring</option>
                      <option value="pendant">Pendant</option>
                      <option value="watch">Watch</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-1">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      id="discount"
                      name="discount"
                      value={formData.discount}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="countInStock" className="block text-sm font-medium text-gray-700 mb-1">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      id="countInStock"
                      name="countInStock"
                      value={formData.countInStock}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="material" className="block text-sm font-medium text-gray-700 mb-1">
                    Material
                  </label>
                  <select
                    id="material"
                    name="material"
                    value={formData.material}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select a material</option>
                    <option value="gold">Gold</option>
                    <option value="silver">Silver</option>
                    <option value="platinum">Platinum</option>
                    <option value="diamond">Diamond</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  ></textarea>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Images
                  </label>
                  {formData.images.map((image, index) => (
                    <div key={index} className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        value={image}
                        onChange={(e) => handleImageChange(index, e.target.value)}
                        placeholder="Image URL"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                      
                      {formData.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImageField(index)}
                          className="px-2 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                        >
                          <FiX />
                        </button>
                      )}
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={addImageField}
                    className="mt-2 text-indigo-600 hover:text-indigo-500 text-sm flex items-center"
                  >
                    <FiPlus className="mr-1" /> Add another image URL
                  </button>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {currentProduct ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Products;