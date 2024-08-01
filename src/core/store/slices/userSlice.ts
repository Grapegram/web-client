import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

type User = {
	email: string | null;
	token: string | null;
};

type UserPayload = {
	email: string;
	token: string;
};

const initialState: User = { email: null, token: null };

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUser(state, action: PayloadAction<UserPayload>) {
			state.email = action.payload.email;
			state.token = action.payload.token;
		},
		deleteUser(state) {
			state.email = null;
			state.token = null;
		},
	},
});

export const { setUser, deleteUser } = userSlice.actions;
export default userSlice.reducer;
