import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../utils/api/axios";

export const fetchNavigators = createAsyncThunk(
    'navigators/fetchNavigators',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(`/navigator-profiles`);
            console.log('fetch navigators for admin response :', response);

            return response.data.data;
        } catch (error) {
            console.log('Error while fetching navigators : ', error);

            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue(error.message);
        }
    }
);

//add new navigator

export const addNewNavigator = createAsyncThunk('navigators/addNewNavigator', async (data, { rejectWithValue }) => {
    try {
        const response = await api.post(`/navigator-profiles`,data);
        console.log('add new navigator response :', response);

        return response.data;
    } catch (error) {
        console.log('Error while adding new navigator : ', error);

        if (error.response && error.response.data.message) {
            return rejectWithValue(error.response.data.message);
        }
        return rejectWithValue(error.message);
    }

})

const NavigatoreSlice = createSlice({
    name: "navigators",
    initialState: {
        list: [],
        isLoading: false,
        error: null,
        add_navigator: {
            status:null,
            isLoading: false,
            error: null
        }
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            //fetch navigators for admin
            .addCase(fetchNavigators.pending, (state) => {
                console.log('fetch all navigators pending');
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchNavigators.fulfilled, (state, action) => {
                console.log('fetch all navigators fulfilled :', action);
                state.isLoading = false;
                state.list = action.payload;
                state.add_navigator.status=null;

            })
            .addCase(fetchNavigators.rejected, (state, action) => {
                console.log('fetch all navigators rejected :', action);
                state.isLoading = false;
                state.error = action.payload;
                state.list = [];
            })

            //add new navigator
            .addCase(addNewNavigator.pending, (state, action) => {
                console.log('add new navigator pending');
                state.add_navigator.isLoading = true
                state.add_navigator.error = null
            })
            .addCase(addNewNavigator.fulfilled, (state, action) => {
                console.log('add new navigator fulfilled : ',action);
                state.add_navigator.isLoading = false
                state.add_navigator.status='success'
                // state.list.push(action.payload.data.user)
                state.add_navigator.error = null
            })
            .addCase(addNewNavigator.rejected, (state, action) => {
                console.log('add new navigator rejected : ',action);
                state.add_navigator.isLoading = false
                state.add_navigator.error = action.payload
            })
    }
})


export default NavigatoreSlice.reducer;