import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/auth';

// Get user from localStorage
const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
  user: user || null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Login user
export const login = createAsyncThunk(
  'auth/login',
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/login`, userData);
      
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Verify OTP
export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async (otpData, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/verify-otp`, otpData);
      
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'OTP verification failed';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Resend OTP
export const resendOTP = createAsyncThunk(
  'auth/resendOTP',
  async (emailData, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/resend-otp`, emailData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to resend OTP';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Forgot password
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, { email });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to request password reset';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Reset password
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (passwordData, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/reset-password`, passwordData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to reset password';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Logout user
export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('user');
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    updateUserInfo: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
      // OTP Verification
      .addCase(verifyOTP.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Resend OTP
      .addCase(resendOTP.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resendOTP.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(resendOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, updateUserInfo } = authSlice.actions;
export default authSlice.reducer;