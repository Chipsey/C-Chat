import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authAPI from "./authAPI";
import localStorageService from "../../utils/localStorage";
import { useNavigate } from "react-router-dom";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      console.log(response);
      localStorageService.setItem("token", response?.data?.auth?.token);
      localStorageService.setItem(
        "userName",
        `${response?.data?.auth?.user?.first_name} ${response?.data?.auth?.user?.last_name}`
      );
      localStorageService.setItem(
        "userEmail",
        response?.data?.auth?.user?.email
      );
      localStorageService.setItem(
        "profilePicture",
        response?.data?.auth?.profilePicture
      );
      return response.data.message;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred during login.";
      return rejectWithValue(errorMessage);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(credentials);
      // console.log(response);
      localStorageService.setItem("token", response?.data?.auth?.token);
      localStorageService.setItem(
        "userName",
        `${response?.data?.auth?.user?.first_name} ${response?.data?.auth?.user?.last_name}`
      );
      localStorageService.setItem(
        "userEmail",
        response?.data?.auth?.user?.email
      );
      localStorageService.setItem(
        "profilePicture",
        response?.data?.auth?.profilePicture
      );
      return response.data.message;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred during login.";
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateProfilePicture = createAsyncThunk(
  "auth/profilePicture",
  async (data, { rejectWithValue }) => {
    try {
      const response = await authAPI.updateProfilePicture(data);
      localStorageService.setItem("profilePicture", response?.data?.fileName);
      return response.data;
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
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProfilePicture.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfilePicture.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateProfilePicture.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
