import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../utils/api/axios";
import { toast } from "sonner";


// get the navigator requests
export const getNavigatorRequests = createAsyncThunk('navigator_request/getNavigatorRequests', async (__, { rejectWithValue }) => {
    try {
        let response = await api.get('/navigator/requests')
        console.log('get navigator requests response :', response);
        return response.data;

    } catch (error) {
        console.log('Error while get navigator response :', error);
        return rejectWithValue(error.response?.data?.message);

    }
})


//update the request status by the navigator
export const updateRequestStatus = createAsyncThunk('navigator_request/updateRequestStatus', async ({ id, status }, { rejectWithValue }) => {
    console.log('status in the slice :', status);

    try {
        let response = await api.patch(`/navigator/requests/${id}/status`, { status: status })
        console.log('update request status response :', response);
        return {
            data: response.data,
            id
        };

    } catch (error) {
        console.log('Error while updating request status response :', error);
        return rejectWithValue(error.response?.data?.message);

    }
})


// get the tourist requests
export const fetchTouristRequests = createAsyncThunk(
    'tourist_request/fetchTouristRequests',
    async (_, { rejectWithValue }) => {
        try {
            let response = await api.get('/tourist/requests');
            console.log('fetch tourist requests response :', response);
            return response.data.data;
        } catch (error) {
            console.log('Error while fetching tourist requests :', error);
            const message = error.response?.data?.message || 'Failed to fetch requests';
            return rejectWithValue(message);
        }
    }
);

// delete a tourist request
export const deleteTouristRequest = createAsyncThunk(
    'tourist_request/deleteTouristRequest',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/tourist/requests/${id}`);
            toast.success('Request deleted successfully!');
            return id;
        } catch (error) {
            console.log('Error while deleting tourist request :', error);
            const message = error.response?.data?.message || 'Failed to delete request';
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

//edit tourist request 
export const updateTouristRequest = createAsyncThunk(
    'tourist_request/updateTouristRequest',
    async ({ id, requestData }, { rejectWithValue }) => {
        try {
            let response = await api.patch(`/tourist/requests/${id}`, requestData);
            toast.success('Request updated successfully!');
            return response.data.data;
        } catch (error) {
            console.log('Error while updating tourist request :', error);
            const message = error.response?.data?.message || 'Failed to update request';
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

const RequestSlice = createSlice({
    name: "requests",
    initialState: {
        navigator: {
            requests: [],
            isLoading: false,
            error: null,
        },
        status_update: {
            statusUpdated: false,
            isLoading: false,
            error: null
        },
        tourist: {
            requests: [],
            isLoading: false,
            error: null,
            isDeleting: false,
            isUpdating: false,
            updateError: null,
        },

    },
    reducers: {
        'update_status_reset': (state, action) => {
            state.status_update.statusUpdated = false
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getNavigatorRequests.pending, (state, action) => {
                console.log('get navigator requests pending');
                state.navigator.isLoading = true;
                state.navigator.error = null

            })
            .addCase(getNavigatorRequests.fulfilled, (state, action) => {
                console.log('get navigator requests fulfilled :', action);
                state.navigator.isLoading = false;
                state.navigator.error = null
                state.navigator.requests = action.payload.data;

            })
            .addCase(getNavigatorRequests.rejected, (state, action) => {
                console.log('get navigator requests rejected :', action);
                state.navigator.isLoading = false;
                state.navigator.error = action.payload
            })

            //update status
            .addCase(updateRequestStatus.pending, (state, action) => {
                console.log('update requests pending');
                state.status_update.isLoading = true;
                state.status_update.error = null
                toast.loading('Submitting...')

            })
            .addCase(updateRequestStatus.fulfilled, (state, action) => {
                console.log('update requests fulfilled :', action);
                state.status_update.isLoading = false;
                state.status_update.error = null
                state.status_update.statusUpdated = true
                toast.dismiss()

            })
            .addCase(updateRequestStatus.rejected, (state, action) => {
                console.log('update requests rejected :', action);
                state.status_update.isLoading = false;
                state.status_update.error = action.payload
                toast.error(action.payload)

            })


            //fetch tourist requests
            .addCase(fetchTouristRequests.pending, (state) => {
                state.tourist.isLoading = true;
                state.tourist.error = null;
            })
            .addCase(fetchTouristRequests.fulfilled, (state, action) => {
                state.tourist.isLoading = false;
                state.tourist.requests = action.payload;
            })
            .addCase(fetchTouristRequests.rejected, (state, action) => {
                state.tourist.isLoading = false;
                state.tourist.error = action.payload;
            })

            //delete tourist request
            .addCase(deleteTouristRequest.pending, (state) => {
                state.tourist.isDeleting = true;
                state.tourist.error = null;
            })
            .addCase(deleteTouristRequest.fulfilled, (state, action) => {
                state.tourist.isDeleting = false;

                const deletedId = action.payload;
                state.tourist.requests = state.tourist.requests.filter(req => req.id !== deletedId);
            })
            .addCase(deleteTouristRequest.rejected, (state, action) => {
                state.tourist.isDeleting = false;
                state.tourist.error = action.payload
            })


            //edit tourist request
            .addCase(updateTouristRequest.pending, (state) => {
                state.tourist.isUpdating = true;
                state.tourist.updateError = null;
            })
            .addCase(updateTouristRequest.fulfilled, (state, action) => {
                state.tourist.isUpdating = false;
                const updatedRequest = action.payload;
                const index = state.tourist.requests.findIndex(req => req.id === updatedRequest.id);
                if (index !== -1) {
                    state.tourist.requests[index] = updatedRequest;
                }
            })
            .addCase(updateTouristRequest.rejected, (state, action) => {
                state.tourist.isUpdating = false;
                state.tourist.updateError = action.payload;
            });
    }
})

export default RequestSlice.reducer;

export const { update_status_reset } = RequestSlice.actions



