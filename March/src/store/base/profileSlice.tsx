import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserEntity } from "../../entities/user";
import { apiV1 } from "../../libs/api";



interface ProfileState {
    user: UserEntity | null;
    loading: boolean;
    error: string | null
}

const initialState: ProfileState = {

    user: null,
    loading: false,
    error: null,
};

export const updateProfile = createAsyncThunk(
    'profile/updateProfile',
    async (data: Partial<UserEntity>, { rejectWithValue }) => {
        try {
            const res = await apiV1.put("/profile/update", data);
            return res.data;
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    }
);
const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action: PayloadAction<UserEntity>) => {
                state.loading = false;
                state.user = action.payload
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    }
});


export default profileSlice.reducer;