import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/cart';

// Get cart from localStorage for guest users
const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

const initialState = {
  items: cartItems,
  totalItems: cartItems.reduce((total, item) => total + item.quantity, 0),
  totalAmount: cartItems.reduce((total, item) => total + (item.price * item.quantity), 0),
  isLoading: false,
  isError: false,
  message: '',
};

// Get cart (for authenticated users)
export const getCart = createAsyncThunk(
  'cart/getCart',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      
      if (!token) {
        return cartItems; // Return localStorage cart for guest users
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.get(API_URL, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to get cart';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Add item to cart
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (cartItem, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      
      if (!token) {
        // For guest users, manage cart in localStorage
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const existingItem = cartItems.find(item => item.productId === cartItem.productId);
        
        if (existingItem) {
          existingItem.quantity += cartItem.quantity;
        } else {
          cartItems.push(cartItem);
        }
        
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        return cartItems;
      }
      
      // For authenticated users, use API
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.post(API_URL, cartItem, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add to cart';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update cart item quantity
export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ productId, quantity }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      
      if (!token) {
        // For guest users, update in localStorage
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const updatedCartItems = cartItems.map(item => 
          item.productId === productId ? { ...item, quantity } : item
        );
        
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
        return updatedCartItems;
      }
      
      // For authenticated users, use API
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.put(`${API_URL}/${productId}`, { quantity }, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update cart';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Remove item from cart
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (productId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      
      if (!token) {
        // For guest users, remove from localStorage
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const updatedCartItems = cartItems.filter(item => item.productId !== productId);
        
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
        return updatedCartItems;
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
      const message = error.response?.data?.message || 'Failed to remove from cart';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Clear cart
export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      
      if (!token) {
        // For guest users, clear localStorage
        localStorage.removeItem('cartItems');
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
      const message = error.response?.data?.message || 'Failed to clear cart';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    calculateTotals: (state) => {
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Cart
      .addCase(getCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.totalItems = action.payload.reduce((total, item) => total + item.quantity, 0);
        state.totalAmount = action.payload.reduce((total, item) => total + (item.price * item.quantity), 0);
      })
      .addCase(getCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.totalItems = action.payload.reduce((total, item) => total + item.quantity, 0);
        state.totalAmount = action.payload.reduce((total, item) => total + (item.price * item.quantity), 0);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update Cart Item
      .addCase(updateCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.totalItems = action.payload.reduce((total, item) => total + item.quantity, 0);
        state.totalAmount = action.payload.reduce((total, item) => total + (item.price * item.quantity), 0);
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Remove from Cart
      .addCase(removeFromCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.isLoading = false;
        if (typeof action.payload === 'string') {
          // If we received a productId
          state.items = state.items.filter(item => item.productId !== action.payload);
        } else {
          // If we received updated items array
          state.items = action.payload;
        }
        state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
        state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Clear Cart
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.totalItems = 0;
        state.totalAmount = 0;
      });
  },
});

export const { calculateTotals } = cartSlice.actions;
export default cartSlice.reducer;