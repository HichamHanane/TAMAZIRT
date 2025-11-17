import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../utils/api/axios';



// fetch the verfied navigators
export const fetchNavigators = createAsyncThunk(
    'navigators/fetchNavigators',
    async (params = { page: 1, city: '', language: '' }, { rejectWithValue }) => {
        try {
            // Build the query parameters
            const { page, city, language } = params;
            const queryParams = new URLSearchParams({
                page: page,
                ...(city && { city: city }),
                ...(language && { language: language }),
            }).toString();

            // Your Laravel API route for getting navigators
            const response = await api.get(`tourist/navigators?${queryParams}`
            );

            // The API returns the paginated structure directly in response.data
            return response.data.data;

        } catch (error) {
            // Use rejectWithValue to return the error message from the backend
            return rejectWithValue(error.response.data.message || 'Failed to fetch navigators.');
        }
    }
);

const guideSlice = createSlice({
    name: 'guides',
    initialState: {
        items: [],          // Array of navigator data
        status: 'idle',     // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
        // Pagination state
        currentPage: 1,
        lastPage: 1,
        total: 0,
    },
    reducers: {
        // Reducers for simple synchronous actions (none needed here for now)
    },
    extraReducers: (builder) => {
        builder
            // Handling the PENDING state (loading)
            .addCase(fetchNavigators.pending, (state) => {
                state.status = 'loading';
            })
            // Handling the FULFILLED state (success)
            .addCase(fetchNavigators.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // action.payload contains the paginated response object from Laravel
                state.items = action.payload.data; // The actual list of guides
                state.currentPage = action.payload.current_page;
                state.lastPage = action.payload.last_page;
                state.total = action.payload.total;
                state.error = null;
            })
            // Handling the REJECTED state (error)
            .addCase(fetchNavigators.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
            });
    },
});

export default guideSlice.reducer;