import { configureStore } from '@reduxjs/toolkit';
import AuthSlice from '../feature/AuthSlice'
import ApplicationSlice from '../feature/ApplicationSlice'

export const store = configureStore({
    reducer: {
        auth: AuthSlice,
        applications: ApplicationSlice
    },
});