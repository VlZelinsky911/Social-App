import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
username: string | null,
avatar: string,
}

const initialState: UserState = {
 username: null,
 avatar: "",
}

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUser: (state, action:PayloadAction<UserState>) => {
			state.username = action.payload.username;
			state.avatar = action.payload.avatar;
		},
	},
});

export const {setUser} = userSlice.actions;
export default userSlice.reducer;