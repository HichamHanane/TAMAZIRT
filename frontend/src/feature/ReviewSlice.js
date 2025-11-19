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


// get tourist reviews
export const getTouristReviews = createAsyncThunk('tourist_reviews/getTouristReviews', async (_, { rejectWithValue }) => {
    try {
        let response = await api.get(`/my-reviews`)
        console.log('get tourist reviews response :', response);
        return response.data;
    } catch (error) {
        console.log('Error while get tourist reviews response :', error);
        return rejectWithValue(error.response?.data?.message);
    }
})


// delete review by the tourist
export const deleteReview = createAsyncThunk('tourist_reviews/deleteReview', async (reviewId, { rejectWithValue }) => {
    try {
        let response = await api.delete(`/reviews/${reviewId}`);
        console.log('Delete review response :', response);
        return reviewId;
    } catch (error) {
        console.log('Error while deleting review:', error);
        return rejectWithValue(error.response?.data?.message || 'Failed to delete review');
    }
});

//update review
export const updateReview = createAsyncThunk('tourist_reviews/updateReview', async ({ id, rating, comment }, { rejectWithValue }) => {
    try {
        let response = await api.patch(`/reviews/${id}`, {
            rating,
            comment
        });
        console.log('Edit review response :', response);

        return response.data.data;
    } catch (error) {
        console.log('Error while updating review:', error);
        return rejectWithValue(error.response?.data?.message || 'Failed to update review');
    }
});

const ReviewSlice = createSlice({
    name: 'reviews',
    initialState: {
        navigator: {
            reviews: [],
            isLoading: false,
            error: null
        },
        tourist: {
            reviews: [],
            isLoading: false,
            error: null
        },
        delete_review: {
            isLoading: false,
            error: null
        },
        update_review: {
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


            //fetch tourist reviews
            .addCase(getTouristReviews.pending, (state) => {
                console.log('get tourist reviews pending');
                state.tourist.isLoading = true;
                state.tourist.error = null
            })
            .addCase(getTouristReviews.fulfilled, (state, action) => {
                console.log('get tourist reviews fulfilled : ', action);
                state.tourist.isLoading = false;
                state.tourist.error = null
                state.tourist.reviews = action.payload.data
            })
            .addCase(getTouristReviews.rejected, (state, action) => {
                console.log('get tourist reviews rejected : ', action);
                state.tourist.isLoading = false;
                state.tourist.error = action.payload
            })

            // delete a review
            .addCase(deleteReview.pending, (state) => {
                state.delete_review.isLoading = true;
                state.delete_review.error = null
            })
            .addCase(deleteReview.fulfilled, (state, action) => {
                state.delete_review.isLoading = false
                state.delete_review.error = null
                const deletedId = action.payload;
                state.tourist.reviews = state.tourist.reviews.filter(
                    (review) => review.id !== deletedId
                );
            })
            .addCase(deleteReview.rejected, (state, action) => {
                console.error('Delete review rejected:', action.payload);
                state.delete_review.isLoading = false
                state.delete_review.error = action.payload;
            })


            //eidt review
            .addCase(updateReview.pending, (state, action) => {
                console.error('Update review pending:', action);
                state.update_review.isLoading = true;
                state.update_review.error = null
            })
            .addCase(updateReview.fulfilled, (state, action) => {
                const updatedReview = action.payload;
                state.update_review.isLoading = false;
                state.update_review.error = null
                const index = state.tourist.reviews.findIndex(
                    (review) => review.id === updatedReview.id
                );

                if (index !== -1) {
                    state.tourist.reviews[index] = updatedReview;
                }
            })
            .addCase(updateReview.rejected, (state, action) => {
                state.update_review.isLoading = false;
                console.error('Update review rejected:', action.payload);
                state.tourist.error = action.payload;
            })

    }
});


export default ReviewSlice.reducer;