import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/products';

const initialState = {
  products: [],
  product: null,
  topSelling: [],
  filteredProducts: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  filters: {
    category: [],
    priceRange: [0, 10000], // Default price range
    searchTerm: '',
  },
};

// Get all products
export const getProducts = createAsyncThunk(
  'product/getProducts',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch products';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get product by ID
export const getProductById = createAsyncThunk(
  'product/getProductById',
  async (productId, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/${productId}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch product';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get top selling products
export const getTopSelling = createAsyncThunk(
  'product/getTopSelling',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/top-selling`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch top selling products';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Search products
export const searchProducts = createAsyncThunk(
  'product/searchProducts',
  async (searchTerm, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/search?term=${searchTerm}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to search products';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create product (Admin)
export const createProduct = createAsyncThunk(
  'product/createProduct',
  async (productData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.post(API_URL, productData, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create product';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update product (Admin)
export const updateProduct = createAsyncThunk(
  'product/updateProduct',
  async ({ productId, productData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.put(`${API_URL}/${productId}`, productData, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update product';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete product (Admin)
export const deleteProduct = createAsyncThunk(
  'product/deleteProduct',
  async (productId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      await axios.delete(`${API_URL}/${productId}`, config);
      return productId;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete product';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Add review
export const createProductReview = createAsyncThunk(
  'product/addReview',
  async ({ productId, reviewData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.post(`${API_URL}/${productId}/reviews`, reviewData, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add review';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        category: [],
        priceRange: [0, 10000],
        searchTerm: '',
      };
      state.filteredProducts = state.products;
    },
    applyFilters: (state) => {
      state.filteredProducts = state.products.filter(product => {
        // Filter by category
        const categoryMatch = state.filters.category.length === 0 || 
          state.filters.category.includes(product.category);
          
        // Filter by price range
        const priceMatch = product.price >= state.filters.priceRange[0] && 
          product.price <= state.filters.priceRange[1];
          
        // Filter by search term
        const searchMatch = state.filters.searchTerm === '' || 
          product.name.toLowerCase().includes(state.filters.searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(state.filters.searchTerm.toLowerCase());
          
        return categoryMatch && priceMatch && searchMatch;
      });
    },
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all products
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.products = action.payload;
        state.filteredProducts = action.payload;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Get product by ID
      .addCase(getProductById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.product = action.payload;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Get top selling products
      .addCase(getTopSelling.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTopSelling.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.topSelling = action.payload;
      })
      .addCase(getTopSelling.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Search products
      .addCase(searchProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.filteredProducts = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Create product (Admin)
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.products.push(action.payload);
        state.filteredProducts.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Update product (Admin)
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.products = state.products.map(product => 
          product._id === action.payload._id ? action.payload : product
        );
        state.filteredProducts = state.filteredProducts.map(product => 
          product._id === action.payload._id ? action.payload : product
        );
        state.product = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Delete product (Admin)
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.products = state.products.filter(product => product._id !== action.payload);
        state.filteredProducts = state.filteredProducts.filter(product => product._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Add review
      .addCase(createProductReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createProductReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.product = action.payload;
        
        // Update the product in products array
        const index = state.products.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        
        // Update the product in filteredProducts array
        const filteredIndex = state.filteredProducts.findIndex(p => p._id === action.payload._id);
        if (filteredIndex !== -1) {
          state.filteredProducts[filteredIndex] = action.payload;
        }
      })
      .addCase(createProductReview.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { setFilters, clearFilters, applyFilters, reset } = productSlice.actions;
export default productSlice.reducer;