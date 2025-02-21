import { configureStore } from "@reduxjs/toolkit";
import UseReducer from "../../features/user/userSlice";

export const store = configureStore({
	reducer: {
		user: UseReducer
	}
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;