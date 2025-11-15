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
        }

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
    }
})

export default RequestSlice.reducer;

export const { update_status_reset } = RequestSlice.actions



