import { configureStore } from "@reduxjs/toolkit";
import UseReducer from "../../features/user/userSlice";
import AuthReducer from "../../features/auth/authSlice";

export const store = configureStore({
	reducer: {
		user: UseReducer,
		auth: AuthReducer
	}
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;