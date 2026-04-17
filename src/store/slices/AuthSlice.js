/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/ApiClient";
import { API_ROUTES } from "../../api/ApiRoutes";

export const loginEmployee = createAsyncThunk("auth/login", async (creds, { rejectWithValue }) => {
  try {
    const res = await apiClient.post(API_ROUTES.AUTH.LOGIN, creds);
    return {
      token: res.data.accessToken || res.data.data?.accessToken,
      user: res.data.user || res.data.data?.user
    };
  } catch (err) { return rejectWithValue(err.response?.data?.message || "Login Failed"); }
});

export const fetchCurrentUser = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      console.log("before api call");

      const res = await apiClient.get(API_ROUTES.USER.ME);

      console.log("Fetched user profile:", res.data);

      return res.data.data || res.data.user || res.data;
    } catch (err) {
      if (err.__CANCEL__) return;

      return rejectWithValue("Session Expired");
    }
  },
  {
    condition: (_, { getState }) => {
      const { auth } = getState();

      // ❗ Prevent duplicate calls
      if (auth.loading || auth.user) {
        return false;
      }
    }
  }
);

export const forgotPassword = createAsyncThunk("auth/forgot", async (email, { rejectWithValue }) => {
  try {
    const res = await apiClient.post(API_ROUTES.AUTH.FORGOT_PASSWORD, { email });
    return res.data.message;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const resetPassword = createAsyncThunk(
  "auth/reset", 
  async ({ token, newPassword, confirmNewPassword }, { rejectWithValue }) => {
    try {
      // Send a flat object directly to match Postman test
      const res = await apiClient.post(API_ROUTES.AUTH.RESET_PASSWORD(token), { 
        newPassword, 
        confirmNewPassword 
      });
      return res.data.message;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to reset password");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, token: null, isAuthenticated: false, loading: false, error: null },
  reducers: {
   setAuthToken: (state, action) => {
  state.token = action.payload;
  state.isAuthenticated = true;
  localStorage.setItem("token", action.payload); // 🔑 Store it!
},
logout: (state) => {
  state.user = null;
  state.token = null;
  state.isAuthenticated = false;
  state.error = null;
  localStorage.removeItem("token"); // 🔑 Clean it!
},
    clearError: (state) => { state.error = null; }
  },
extraReducers: (builder) => {
  builder
    .addCase(loginEmployee.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(loginEmployee.fulfilled, (state, action) => {
      state.loading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;

      localStorage.setItem("token", action.payload.token);
    })
    .addCase(loginEmployee.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    .addCase(fetchCurrentUser.pending, (state) => {
      state.loading = true;
    })
    .addCase(fetchCurrentUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    })
    .addCase(fetchCurrentUser.rejected, (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    });
}
});

export const { setAuthToken, logout, clearError } = authSlice.actions;
export default authSlice.reducer;