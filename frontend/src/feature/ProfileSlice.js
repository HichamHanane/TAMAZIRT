import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api/axios';


//fetch user
export const fetchUserProfile = createAsyncThunk(
    'userProfile/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(`/user`);
            console.log("fetch auth user response :", response);
            return response.data;
        } catch (error) {
            console.log('Error while fetching the auth user : ', error);

            const message = error.response?.data?.message || error.message || 'Failed to fetch user profile';
            return rejectWithValue(message);
        }
    }
);

export const updateUserProfile = createAsyncThunk(
    'userProfile/update',
    async ({ data, id }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/profile/${id}`, data);
            console.log('Edit profile response : ', response);
            return response.data.data;
        } catch (error) {
            console.log('Error while editing the profile :',error);
            const message = error.response?.data?.message || error.message || 'Failed to update profile';
            return rejectWithValue(message);
        }
    }
);

const ProfileSlice = createSlice({
    name: 'userProfile',
    initialState: {
        user: null,
        isLoading: false,
        error: null,
        isUpdating: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        //fetch user
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                console.log('fetch user pending');

                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                console.log('fetch user fulfilled : ', action);

                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                console.log('fetch user rejected : ', action);

                state.isLoading = false;
                state.error = action.payload;
            })


            //edit profile
            .addCase(updateUserProfile.pending, (state) => {
                console.log('edit profile pending');
                state.isUpdating = true;
                state.error = null;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                console.log('edit profile fulfilled :', action);
                state.isUpdating = false;
                state.user = { ...state.user, ...action.payload };
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                console.log('edit profile rejected :', action);
                state.isUpdating = false;
                state.error = action.payload;
            });
    },
});

export default ProfileSlice.reducer;