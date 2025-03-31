export interface Contact {
    phoneNumber: string;
    givenName?: string;
    messages: string[];
}

export interface ContactsState {
    contacts: Contact[];
    loading: boolean;
    error: string | null;
}

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiRequest } from "../../utils/apiUtils";

// Fetch contacts for a user
export const fetchContacts = createAsyncThunk<
    Contact[],
    string, // userId as parameter
    { rejectValue: string }
>(
    "contacts/fetchContacts",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await apiRequest<{ contacts: Contact[] }>("GET", `/api/contacts/${userId}`);
            return response.contacts; // Return contacts from API response
        } catch (error) {
            return rejectWithValue("Failed to fetch contacts");
        }
    }
);


export const addOrUpdateContacts = createAsyncThunk<
    Contact[],
    { userId: string; contacts: Contact[] },
    { rejectValue: string }
>(
    "contacts/addOrUpdateContacts",
    async ({ userId, contacts }, { rejectWithValue }) => {
        try {
            const response = await apiRequest<{ contacts: Contact[] }>("POST", "/api/contacts", { userId, contacts });
            return response.contacts; // Return updated contacts from API response
        } catch (error) {
            return rejectWithValue("Failed to update contacts");
        }
    }
);

const initialState: ContactsState = {
    contacts: [],
    loading: false,
    error: null,
};

// Contacts slice
const contactsSlice = createSlice({
    name: "contacts",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch contacts
            .addCase(fetchContacts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchContacts.fulfilled, (state, action: PayloadAction<Contact[]>) => {
                state.loading = false;
                state.contacts = action.payload;
            })
            .addCase(fetchContacts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch contacts";
            })

            // Add or update contacts
            .addCase(addOrUpdateContacts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addOrUpdateContacts.fulfilled, (state, action: PayloadAction<Contact[]>) => {
                state.loading = false;
                state.contacts = action.payload; // Replace with updated contacts
            })
            .addCase(addOrUpdateContacts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to update contacts";
            });
    },
});

export default contactsSlice.reducer;