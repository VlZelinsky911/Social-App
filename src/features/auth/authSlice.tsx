import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  isProfileComplete: boolean;
}

const initialState: AuthState = {
  isAuthenticated: !!localStorage.getItem("user"),
  isProfileComplete: !!localStorage.getItem("profile_complete"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state) => {
      state.isAuthenticated = true;
      localStorage.setItem("user", "true");
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.isProfileComplete = false; 
      localStorage.removeItem("user");
      localStorage.removeItem("profile_complete");
    },
    setProfileComplete: (state, action) => {
      state.isProfileComplete = action.payload;
      localStorage.setItem("profile_complete", action.payload ? "true" : "false");
    },
  },
});

export const { login, logout, setProfileComplete } = authSlice.actions;
export default authSlice.reducer;
