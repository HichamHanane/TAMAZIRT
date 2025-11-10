import { configureStore } from '@reduxjs/toolkit';
import AuthSlice from '../feature/AuthSlice'

export const store = configureStore({
    reducer: {
        auth:AuthSlice
    },
});