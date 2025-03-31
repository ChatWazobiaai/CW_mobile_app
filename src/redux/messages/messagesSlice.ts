import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiRequest } from "../../utils/apiUtils";
import { Message } from "../../types/Messages.types";


interface MessagesState {
    messages: Message[];
    loading: boolean;
    error: string | null;
    message: string;
    statusCode: number | null;
}

const initialState: MessagesState = {
    messages: [],
    loading: false,
    error: null,
    message: "",
    statusCode: null,
};

export const fetchMessages = createAsyncThunk(
    "messages/fetchMessages",
    async (messagesArrayID: string, { rejectWithValue }) =>
        apiRequest<{ messages: Message[] }>(
            "GET",
            `/api/messages/get-messages/${messagesArrayID}`,
            {},
            rejectWithValue,
            false
        )
);

const messagesSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        clearMessagesState: (state) => {
            state.loading = false;
            state.messages = [];
            state.error = null;
            state.message = "";
            state.statusCode = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMessages.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.statusCode = null;
            })
            .addCase(fetchMessages.fulfilled, (state, action: PayloadAction<{ messages: Message[] }>) => {
                state.loading = false;
                state.messages = action.payload.messages;
                state.statusCode = 200;
            })
            .addCase(fetchMessages.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
                state.statusCode = action.payload?.statusCode || 500;
            });
    },
});

export const { clearMessagesState } = messagesSlice.actions;
export default messagesSlice.reducer;