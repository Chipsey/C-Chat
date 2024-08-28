// src/features/user/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: null, // To store user details after login
    status: "idle", // For tracking loading status
    error: null, // To store any error messages
  },
  reducers: {
    loginRequest(state) {
      state.status = "loading";
      state.error = null;
    },
    loginSuccess(state, action) {
      state.userInfo = action.payload;
      state.status = "succeeded";
      state.error = null;
    },
    loginFailure(state, action) {
      state.status = "failed";
      state.error = action.payload;
    },
    logout(state) {
      state.userInfo = null;
      state.status = "idle";
      state.error = null;
    },
    updateUserInfo(state, action) {
      state.userInfo = { ...state.userInfo, ...action.payload };
    },
  },
});

// Export actions
export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  logout,
  updateUserInfo,
} = userSlice.actions;

// Export reducer
export default userSlice.reducer;
