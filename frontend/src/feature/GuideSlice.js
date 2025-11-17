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

// setn request to the guide
export const sendNavigatorRequest = createAsyncThunk(
    'navigators/sendRequest',
    async (requestData, { rejectWithValue }) => {
        console.log('the recieved data from the component :', requestData);

        try {
            const response = await api.post(
                'tourist/requests',
                requestData
            );
            console.log('Setn request to the guide response : ', response);

            return response.data;

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Submission failed.';
            return rejectWithValue(errorMessage);
        }
    }
);

const guideSlice = createSlice({
    name: 'guides',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
        currentPage: 1,
        lastPage: 1,
        total: 0,
        sent_request: {
            isLoading: false,
            error: null
        }
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            // fetch all the navigators
            .addCase(fetchNavigators.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchNavigators.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.data;
                state.currentPage = action.payload.current_page;
                state.lastPage = action.payload.last_page;
                state.total = action.payload.total;
                state.error = null;
            })
            .addCase(fetchNavigators.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
            })


            // sent request to the guide
            .addCase(sendNavigatorRequest.pending, (state) => {
                console.log("setn request to guide pending :");

                state.sent_request.isLoading = true
                state.sent_request.error = null;
            })
            .addCase(sendNavigatorRequest.fulfilled, (state, action) => {
                console.log("setn request to guide fulfilled :", action);

                state.sent_request.isLoading = false
                state.sent_request.error = null;
            })
            .addCase(sendNavigatorRequest.rejected, (state, action) => {
                console.log("setn request to guide rejected :", action);
                state.sent_request.isLoading = false
                state.sent_request.error = action.payload;
            });
    },
});

export default guideSlice.reducer;