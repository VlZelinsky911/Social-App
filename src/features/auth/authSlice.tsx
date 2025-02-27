import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
	isAuthenticated: boolean;
}

const initialState: AuthState = {
	isAuthenticated: !!localStorage.getItem("user"),
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
      localStorage.removeItem("user");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;