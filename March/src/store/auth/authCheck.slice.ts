import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthCheckState {
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: AuthCheckState = {
    isAuthenticated: false,
    loading: false,
    error: null,
};

const authCheckSlice = createSlice({
    name: "authCheck",
    initialState,
    reducers: {
        checkAuthStart(state) {
            state.loading = true;
            state.error = null;
        },
        checkAuthSuccess(state) {
            state.loading = false;
            state.isAuthenticated = true;
        },
        checkAuthFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
        },
        resetAuthCheck(state) {
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
        },
    },
});

export const {
    checkAuthStart,
    checkAuthSuccess,
    checkAuthFailure,
    resetAuthCheck,
} = authCheckSlice.actions;

export default authCheckSlice.reducer;
