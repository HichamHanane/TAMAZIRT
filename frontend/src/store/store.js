import { configureStore } from '@reduxjs/toolkit';
import AuthSlice from '../feature/AuthSlice'
import ApplicationSlice from '../feature/ApplicationSlice'
import NavigatoreSlice from '../feature/NavigatorSlice'
import touristsReducer from '../feature/touristsSlice'
export const store = configureStore({
    reducer: {
        auth: AuthSlice,
        applications: ApplicationSlice,
        navigators: NavigatoreSlice,
        tourists: touristsReducer,
    },
});