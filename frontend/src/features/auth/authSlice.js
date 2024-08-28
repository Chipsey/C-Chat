import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authAPI from "./authAPI";
import localStorageService from "../../utils/localStorage";
import { useNavigate } from "react-router-dom";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      // console.log(response);
      localStorageService.setItem("token", response?.data?.auth?.token);
      localStorageService.setItem("userName", response?.data?.auth?.userName);
      localStorageService.setItem("userEmail", response?.data?.auth?.userEmail);
      return response.data.message;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred during login.";
      return rejectWithValue(errorMessage);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
