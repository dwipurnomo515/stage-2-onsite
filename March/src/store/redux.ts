import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/auth.slice"
import authCheckReducer from "./auth/authCheck.slice"; // Auth check slice

export const store = configureStore({
    reducer: {
        auth: authReducer,
        authCheck: authCheckReducer,

    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch