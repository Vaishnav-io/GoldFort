import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/users';

const initialState = {
  users: [],
  profile: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Get all users (admin only)
export const getUsers = createAsyncThunk(
  'user/getUsers',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.get(`${API_URL}`, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch users';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get user by ID (admin only)
export const getUserById = createAsyncThunk(
  'user/getUserById',
  async (userId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.get(`${API_URL}/${userId}`, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch user';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update user (admin only)
export const updateUser = createAsyncThunk(
  'user/updateUser',
  async ({ userId, userData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.put(`${API_URL}/${userId}`, userData, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update user';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete user (admin only)
export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (userId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      await axios.delete(`${API_URL}/${userId}`, config);
      return userId;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete user';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get user profile
export const getUserProfile = createAsyncThunk(
  'user/getUserProfile',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.get(`${API_URL}/profile`, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch profile';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update user profile
export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (userData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.put(`${API_URL}/profile`, userData, config);
      
      // Update auth state with new user info if password wasn't changed
      if (!userData.password) {
        thunkAPI.dispatch({ 
          type: 'auth/updateUserInfo', 
          payload: response.data
        });
      }
      
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Add user address
export const addUserAddress = createAsyncThunk(
  'user/addUserAddress',
  async (addressData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.post(`${API_URL}/address`, addressData, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add address';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update user address
export const updateUserAddress = createAsyncThunk(
  'user/updateUserAddress',
  async ({ addressId, addressData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.put(`${API_URL}/address/${addressId}`, addressData, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update address';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete user address
export const deleteUserAddress = createAsyncThunk(
  'user/deleteUserAddress',
  async (addressId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.delete(`${API_URL}/address/${addressId}`, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete address';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Set default address
export const setDefaultAddress = createAsyncThunk(
  'user/setDefaultAddress',
  async (addressId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.put(`${API_URL}/address/${addressId}/default`, {}, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to set default address';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
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
      // Get users
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Get user by ID
      .addCase(getUserById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = state.users.map(user => 
          user._id === action.payload._id ? action.payload : user
        );
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = state.users.filter(user => user._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Get user profile
      .addCase(getUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.profile = action.payload;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Update user profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.profile = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Add user address
      .addCase(addUserAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addUserAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.profile = { ...state.profile, addresses: action.payload };
      })
      .addCase(addUserAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Update user address
      .addCase(updateUserAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.profile = { ...state.profile, addresses: action.payload };
      })
      .addCase(updateUserAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Delete user address
      .addCase(deleteUserAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteUserAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.profile = { ...state.profile, addresses: action.payload };
      })
      .addCase(deleteUserAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Set default address
      .addCase(setDefaultAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.profile = { ...state.profile, addresses: action.payload };
      })
      .addCase(setDefaultAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = userSlice.actions;
export default userSlice.reducer;