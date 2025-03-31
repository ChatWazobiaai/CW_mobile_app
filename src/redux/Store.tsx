import {configureStore} from '@reduxjs/toolkit';
import OtpSlice from './Otp/OtpSlice';
import updateUsernameSlice from './user/updateUsernameSlice';
import contactsSlice from './contacts/contactsSlice';
import messagesSlice from './messages/messagesSlice';

export const store = configureStore({
  reducer: {
    OtpSlice: OtpSlice,
    updateUsernameSlice: updateUsernameSlice,
    contactsSlice: contactsSlice,
    messagesSlice: messagesSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
