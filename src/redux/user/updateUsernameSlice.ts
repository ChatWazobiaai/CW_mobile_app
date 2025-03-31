import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiRequest } from '../../utils/apiUtils';

// Define the state for the username update process
interface UpdateUsernameState {
    loading: boolean;
    success: boolean;
    error: string | null;
    message: string;
    statusCode: number | null;
    user: object | null; // Store the updated user data if necessary
}

// Define the initial state
const initialState: UpdateUsernameState = {
    loading: false,
    success: false,
    error: null,
    message: '',
    statusCode: null,
    user: null,
};

// Define the async action for updating the username
export const updateUsername = createAsyncThunk(
    'user/updateUsername',
    async (username: string, { rejectWithValue }) =>
        apiRequest<{ message: string }>('PUT', '/api/auth/update', { username }, rejectWithValue)
);

// Create the slice
const updateUsernameSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearUsernameState: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
            state.message = '';
            state.statusCode = null;
            state.user = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateUsername.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.statusCode = null;
            })
            .addCase(updateUsername.fulfilled, (state, action: PayloadAction<{ user: object }>) => {
                state.loading = false;
                state.success = true;
                state.user = action.payload.user;
                state.message = 'Username updated successfully';
                state.statusCode = 200;
            })
            .addCase(updateUsername.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
                state.statusCode = action.payload?.statusCode || 500;
            });
    },
});

// Export actions and reducer
export const { clearUsernameState } = updateUsernameSlice.actions;
export default updateUsernameSlice.reducer;