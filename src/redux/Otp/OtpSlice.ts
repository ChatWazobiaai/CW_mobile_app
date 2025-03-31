import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiRequest } from '../../utils/apiUtils';

interface OTPState {
    loading: boolean;
    success: boolean;
    error: string | null;
    message: string;
    statusCode: number | null;
}

const initialState: OTPState = {
    loading: false,
    success: false,
    error: null,
    message: '',
    statusCode: null,
};

export const sendOTP = createAsyncThunk(
    'otp/sendOTP',
    async (phoneNumber: string, { rejectWithValue }) =>
        apiRequest<{ message: string }>('POST', '/api/auth/send-otp', { phoneNumber }, rejectWithValue, false)
);

export const resendOTP = createAsyncThunk(
    'otp/resendOTP',
    async (phoneNumber: string, { rejectWithValue }) =>
        apiRequest<{ message: string }>('POST', '/api/auth/resend-otp', { phoneNumber }, rejectWithValue, false)
);

export const verifyOTP = createAsyncThunk(
    'otp/verifyOTP',
    async ({ phoneNumber, otp }: { phoneNumber: string; otp: string }, { rejectWithValue }) =>
        apiRequest<{ message: string }>('POST', '/api/auth/verify-otp', { phoneNumber, otp }, rejectWithValue, false)
);

const otpSlice = createSlice({
    name: 'otp',
    initialState,
    reducers: {
        clearOTPState: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
            state.message = '';
            state.statusCode = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendOTP.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.statusCode = null;
            })
            .addCase(sendOTP.fulfilled, (state, action: PayloadAction<{ message: string }>) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message;
                state.statusCode = 200;
            })
            .addCase(sendOTP.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
                state.statusCode = action.payload?.statusCode || 500;
            })
            .addCase(resendOTP.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.statusCode = null;
            })
            .addCase(resendOTP.fulfilled, (state, action: PayloadAction<{ message: string }>) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message;
                state.statusCode = 200;
            })
            .addCase(resendOTP.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
                state.statusCode = action.payload?.statusCode || 500;
            })
            .addCase(verifyOTP.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.statusCode = null;
            })
            .addCase(verifyOTP.fulfilled, (state, action: PayloadAction<{ message: string }>) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message;
                state.statusCode = 200;
            })
            .addCase(verifyOTP.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
                state.statusCode = action.payload?.statusCode || 500;
            });
    },
});

export const { clearOTPState } = otpSlice.actions;
export default otpSlice.reducer;