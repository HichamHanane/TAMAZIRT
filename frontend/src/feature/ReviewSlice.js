import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../utils/api/axios";


//get navigator reviews

export const getNavigatorReviews = createAsyncThunk('navigator_reviews/getNavigatorReviews', async (_, { rejectWithValue }) => {
    try {
        let response = await api.get(`/navigators/reviews`)
        console.log('get navigator reviews response :', response);
        return response.data;
    } catch (error) {
        console.log('Error while get navigator reviews response :', error);
        return rejectWithValue(error.response?.data?.message);

    }
})

const ReviewSlice = createSlice({
    name: 'reviews',
    initialState: {
        navigator: {
            reviews: [],
            isLoading: false,
            error: null
        }
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getNavigatorReviews.pending, (state) => {
                console.log('get navigator reviews pending');
                state.navigator.isLoading = true;
                state.navigator.error = null

            })
            .addCase(getNavigatorReviews.fulfilled, (state, action) => {
                console.log('get navigator reviews fulfilled : ', action);
                state.navigator.isLoading = false;
                state.navigator.error = null
                state.navigator.reviews = action.payload.data

            })
            .addCase(getNavigatorReviews.rejected, (state, action) => {
                console.log('get navigator reviews rejected : ', action);
                state.navigator.isLoading = false;
                state.navigator.error = action.payload

            })
    }
});


export default ReviewSlice.reducer;