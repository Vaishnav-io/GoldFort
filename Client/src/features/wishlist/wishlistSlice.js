import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/wishlist';

// Get wishlist from localStorage for guest users
const wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];

const initialState = {
  items: wishlistItems,
  isLoading: false,
  isError: false,
  message: '',
};

// Get wishlist (for authenticated users)
export const getWishlist = createAsyncThunk(
  'wishlist/getWishlist',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      
      if (!token) {
        return wishlistItems; // Return localStorage wishlist for guest users
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.get(API_URL, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to get wishlist';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Add item to wishlist
export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      
      if (!token) {
        // For guest users, manage wishlist in localStorage
        const wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];
        
        if (!wishlistItems.includes(productId)) {
          wishlistItems.push(productId);
          localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
        }
        
        return wishlistItems;
      }
      
      // For authenticated users, use API
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.post(API_URL, { productId }, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add to wishlist';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Remove item from wishlist
export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      
      if (!token) {
        // For guest users, remove from localStorage
        const wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];
        const updatedWishlist = wishlistItems.filter(id => id !== productId);
        
        localStorage.setItem('wishlistItems', JSON.stringify(updatedWishlist));
        return updatedWishlist;
      }
      
      // For authenticated users, use API
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      await axios.delete(`${API_URL}/${productId}`, config);
      return productId;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove from wishlist';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Clear wishlist
export const clearWishlist = createAsyncThunk(
  'wishlist/clearWishlist',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      
      if (!token) {
        // For guest users, clear localStorage
        localStorage.removeItem('wishlistItems');
        return [];
      }
      
      // For authenticated users, use API
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      await axios.delete(API_URL, config);
      return [];
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to clear wishlist';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get Wishlist
      .addCase(getWishlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(getWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Add to Wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Remove from Wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        if (typeof action.payload === 'string') {
          // If we received a productId
          state.items = state.items.filter(id => id !== action.payload);
        } else {
          // If we received updated items array
          state.items = action.payload;
        }
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Clear Wishlist
      .addCase(clearWishlist.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export default wishlistSlice.reducer;