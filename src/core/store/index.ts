import { configureStore } from "@reduxjs/toolkit";

import user from "./slices/userSlice";

const store = configureStore({
	reducer: { user },
	devTools: import.meta.env.MODE !== "production",
});

export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
