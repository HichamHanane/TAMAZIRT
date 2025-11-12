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
        const response = await api.post(`/navigator-profiles`, data);
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

//edit navigator
export const editNavigator = createAsyncThunk('navigators/editNavigator', async (payload, { rejectWithValue }) => {
    try {
        console.log("navigato new data : ", payload);

        const response = await api.put(`/admin/navigators/${payload.id}`, payload);
        console.log('edit navigator response :', response);
        return response.data;
    } catch (error) {
        console.log('Error while edting navigator : ', error);

        if (error.response && error.response.data.message) {
            return rejectWithValue(error.response.data.message);
        }
        return rejectWithValue(error.message);
    }
})

//delete navigator

export const deleteNavigator = createAsyncThunk('navigators/deleteNavigator', async (id, { rejectWithValue }) => {
    try {
        console.log("navigato id to delete  : ", id);

        const response = await api.delete(`/navigator-profiles/${id}`);
        console.log('delete navigator response :', response);
        return response.data;
    } catch (error) {
        console.log('Error while delete navigator : ', error);

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
            status: null,
            isLoading: false,
            error: null
        },
        edit_navigator: {
            isLoading: false,
            error: null
        },
        delete_navigator: {
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
                state.add_navigator.status = null;

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
                console.log('add new navigator fulfilled : ', action);
                state.add_navigator.isLoading = false
                state.add_navigator.status = 'success'
                // state.list.push(action.payload.data.user)
                state.add_navigator.error = null
            })
            .addCase(addNewNavigator.rejected, (state, action) => {
                console.log('add new navigator rejected : ', action);
                state.add_navigator.isLoading = false
                state.add_navigator.error = action.payload
            })

            //edit navigator
            .addCase(editNavigator.pending, (state, action) => {
                console.log('edit navigator pending');
                state.edit_navigator.isLoading = true
                state.edit_navigator.error = null
            })
            .addCase(editNavigator.fulfilled, (state, action) => {
                console.log('edit navigator fulfilled : ', action);
                state.edit_navigator.isLoading = false
                state.add_navigator.status = 'success'
                state.edit_navigator.error = null
            })
            .addCase(editNavigator.rejected, (state, action) => {
                console.log('edit navigator rejected : ', action);
                state.edit_navigator.isLoading = false
                state.edit_navigator.error = action.payload
            })

            //delete navigator
            .addCase(deleteNavigator.pending, (state, action) => {
                console.log('delete navigatore pending');
                state.delete_navigator.isLoading = true
                state.delete_navigator.error = null
            })
            .addCase(deleteNavigator.fulfilled, (state, action) => {
                console.log('delete navigatore fulfilled : ', action);
                state.delete_navigator.isLoading = false
                state.add_navigator.status = 'success'
                state.delete_navigator.error = null
            })
            .addCase(deleteNavigator.rejected, (state, action) => {
                console.log('delete navigatore rejected : ', action);
                state.delete_navigator.isLoading = false
                state.delete_navigator.error = action.payload
            })
    }
})


export default NavigatoreSlice.reducer;