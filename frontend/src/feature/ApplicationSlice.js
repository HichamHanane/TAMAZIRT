import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../utils/api/axios";
import { toast } from "sonner";




export const sentApplication = createAsyncThunk('applications/sentApplication', async (data, { rejectWithValue }) => {
    try {
        let response = await api.post('/navigator-applications',data);

        console.log('sent application response :', response);

        return response.data

    }
    catch (error) {
        console.log("Error while sending an application : ", error);
        return rejectWithValue(error.response.data.message);
    }
})


const ApplicationSlice = createSlice({
    name: "applications",
    initialState: {
        sentApplication: {
            isLoading: false,
            error: true
        }
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // sent a new application
            .addCase(sentApplication.pending, (state, action) => {
                console.log('sent application pending');
                state.sentApplication.isLoading = true;
                state.sentApplication.error = null;
            })
            .addCase(sentApplication.fulfilled, (state, action) => {
                console.log('sent application fulfilled :', action);
                state.sentApplication.isLoading = false;
                state.sentApplication.error = null;
            })
            .addCase(sentApplication.rejected, (state, action) => {
                console.log('sent application rejected :', action);
                state.sentApplication.isLoading = false;
                state.sentApplication.error = action.payload;
                toast.error(action.payload)
            })
    }
});

export default ApplicationSlice.reducer;