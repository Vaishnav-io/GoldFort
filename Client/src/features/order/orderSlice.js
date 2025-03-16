import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/orders';

const initialState = {
  orders: [],
  order: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Create new order
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.post(API_URL, orderData, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create order';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get all orders (admin only)
export const getOrders = createAsyncThunk(
  'order/getOrders',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.get(`${API_URL}/all`, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch orders';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get logged in user's orders
export const getMyOrders = createAsyncThunk(
  'order/getMyOrders',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.get(API_URL, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch orders';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get order by ID
export const getOrderById = createAsyncThunk(
  'order/getOrderById',
  async (orderId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.get(`${API_URL}/${orderId}`, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch order';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update order to paid
export const updateOrderToPaid = createAsyncThunk(
  'order/updateOrderToPaid',
  async ({ orderId, paymentResult }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.put(`${API_URL}/${orderId}/pay`, paymentResult, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update order payment';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update order to delivered (admin only)
export const updateOrderToDelivered = createAsyncThunk(
  'order/updateOrderToDelivered',
  async (orderId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.put(`${API_URL}/${orderId}/deliver`, {}, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update order delivery';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete order (admin only)
export const deleteOrder = createAsyncThunk(
  'order/deleteOrder',
  async (orderId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      await axios.delete(`${API_URL}/${orderId}`, config);
      return orderId;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete order';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Get all orders (admin)
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.orders = action.payload;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Get user orders
      .addCase(getMyOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.orders = action.payload;
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Get order by ID
      .addCase(getOrderById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.order = action.payload;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Update order to paid
      .addCase(updateOrderToPaid.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateOrderToPaid.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.order = action.payload;
        state.orders = state.orders.map(order => 
          order._id === action.payload._id ? action.payload : order
        );
      })
      .addCase(updateOrderToPaid.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Update order to delivered
      .addCase(updateOrderToDelivered.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateOrderToDelivered.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.order = action.payload;
        state.orders = state.orders.map(order => 
          order._id === action.payload._id ? action.payload : order
        );
      })
      .addCase(updateOrderToDelivered.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Delete order
      .addCase(deleteOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.orders = state.orders.filter(order => order._id !== action.payload);
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = orderSlice.actions;
export default orderSlice.reducer;