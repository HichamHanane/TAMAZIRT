import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api/axios';

//fetch all touris(admin)
export const fetchAllTourists = createAsyncThunk(
    'tourists/fetchAllTourists',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/admin/tourists");
            console.log('Fetch all tourists :', response);

            return response.data.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed to fetch tourists';
            return rejectWithValue(message);
        }
    }
);


// add new tourist
export const addNewTourist = createAsyncThunk(
    'tourists/addNewTourist',
    async (touristData, { rejectWithValue }) => {
        try {

            const response = await api.post('/admin/tourists', touristData);
            console.log('Add new tourist response :', response);
            return response.data.data;
        } catch (error) {
            console.log('error while adding new tourist : ', error);

            const message = error.response?.data?.message || error.message || 'Failed to create tourist';
            return rejectWithValue(message);
        }
    }
);

// delete tourist
export const deleteTourist = createAsyncThunk(
    'tourists/deleteTourist',
    async (id, { rejectWithValue }) => {
        try {

            const response = await api.delete(`/admin/tourists/${id}`);
            console.log('delete tourist response :', response);
            // return response.data.data;
            return {
                id,
                data : response.data.data
            }
        } catch (error) {
            console.log('error while deleting tourist : ', error);

            const message = error.response?.data?.message || error.message || 'Failed to create tourist';
            return rejectWithValue(message);
        }
    }
);

const touristsSlice = createSlice({
    name: 'tourists',
    initialState: {
        tourists: [],
        isLoading: false,
        error: null,
        delete_tourist: {
            isLoading: false,
            error: null
        }
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetchAllTourists
            .addCase(fetchAllTourists.pending, (state) => {
                console.log('fetch all tourist pending');
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAllTourists.fulfilled, (state, action) => {
                console.log('fetch all tourist fulfilled :', action);
                state.isLoading = false;
                state.tourists = action.payload;
            })
            .addCase(fetchAllTourists.rejected, (state, action) => {
                console.log('fetch all tourist rejected :', action);
                state.isLoading = false;
                state.error = action.payload;
            })

            // add new tourist
            .addCase(addNewTourist.pending, (state) => {
                console.log('add new tourist pending');
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addNewTourist.fulfilled, (state, action) => {
                console.log('add new tourist fulfilled : ', action);
                state.isLoading = false;
                state.error = null;
                state.tourists.unshift(action.payload);
            })
            .addCase(addNewTourist.rejected, (state, action) => {
                console.log('add new tourist rejected : ', action);
                state.isLoading = false;
                state.error = action.payload;
            })

            // delete tourist tourist
            .addCase(deleteTourist.pending, (state) => {
                console.log('delete tourist tourist pending');
                state.delete_tourist.isLoading = true;
                state.delete_tourist.error = null;
            })
            .addCase(deleteTourist.fulfilled, (state, action) => {
                console.log('delete tourist tourist fulfilled : ', action);
                state.delete_tourist.isLoading = false;
                state.tourists = state.tourists.filter(tourist => tourist.id != action.payload.id )
            })
            .addCase(deleteTourist.rejected, (state, action) => {
                console.log('delete tourist tourist rejected : ', action);
                state.delete_tourist.isLoading = false;
                state.delete_tourist.error = action.payload;
            })
    },
});

export default touristsSlice.reducer;