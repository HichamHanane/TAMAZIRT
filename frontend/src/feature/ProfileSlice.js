import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api/axios';
import { VeganIcon } from 'lucide-react';


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

// fetch navigator profile
export const fetchNavigatorProfile = createAsyncThunk(
    'navigatorProfile/fetchNavigatorProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(`/navigator-profile`);
            console.log("fetch navigator profile response :", response);
            return response.data;
        } catch (error) {
            console.log('Error while fetching the navigator profile : ', error);
            return rejectWithValue(error.response?.data?.message);
        }
    }
);


//update navigator profile
export const updateNavigatorProfile = createAsyncThunk(
    'navigatorProfile/updateNavigatorProfile',
    async ({ payload, id }, { rejectWithValue }) => {
        console.log('Data To send update navigator profile :', payload);
        console.log('ID  navigator  :', id);

        try {
            const response = await api.post(`/navigator-profiles/${id}`, payload);
            console.log('Edit navigator profile response : ', response);
            return response.data.data;
        } catch (error) {
            console.log('Error while editing the navigator profile :', error);
            return rejectWithValue(error.response?.data?.message);
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
            console.log('Error while editing the profile :', error);
            const message = error.response?.data?.message || error.message || 'Failed to update profile';
            return rejectWithValue(message);
        }
    }
);

//update navigtore password
export const updatePassword = createAsyncThunk(
    'user/updatePassword',
    async (payload, { rejectWithValue }) => {
        console.log('the data inside the slice : ',payload);
        
        try {
            const response = await api.put('/user/password', payload);
            console.log('Password update response:', response);
            return response.data;
        } catch (error) {
            console.error('Error while updating password:', error);
            return rejectWithValue(error.response?.data?.message || 'Failed to update password');
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
        user_profile: {
            profile: null,
            isLoading: false,
            error: null
        },
        update_navigator: {
            isLoading: false,
            error: null
        },
        password_update_status: {
            isLoading: false,
            error: null,
        }
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
            })

            // fetch navigator profile 
            .addCase(fetchNavigatorProfile.pending, (state) => {
                console.log('fetch navigator pending');
                state.user_profile.isLoading = true;
                state.user_profile.error = null;
            })
            .addCase(fetchNavigatorProfile.fulfilled, (state, action) => {
                console.log('fetch navigator fulfilled : ', action);
                state.user_profile.isLoading = false;
                state.user_profile.profile = action.payload.data;
            })
            .addCase(fetchNavigatorProfile.rejected, (state, action) => {
                console.log('fetch navigator rejected : ', action);

                state.user_profile.isLoading = false;
                state.user_profile.error = action.payload;
            })

            //edit navigator profile
            .addCase(updateNavigatorProfile.pending, (state) => {
                console.log('edit navigator profile pending');
                state.update_navigator.isLoading = true;
                state.update_navigator.error = null;
            })
            .addCase(updateNavigatorProfile.fulfilled, (state, action) => {
                console.log('edit navigator profile fulfilled :', action);
                state.update_navigator.isLoading = false;
                state.user_profile.profile = { ...state.user_profile.profile, ...action.payload };
            })
            .addCase(updateNavigatorProfile.rejected, (state, action) => {
                console.log('edit navigator profile rejected :', action);
                state.update_navigator.isLoading = false;
                state.update_navigator.error = action.payload;
            })

            // update navigator password
            .addCase(updatePassword.pending, (state) => {
                state.password_update_status.isLoading = true;
                state.password_update_status.error = null;
            })
            .addCase(updatePassword.fulfilled, (state) => {
                state.password_update_status.isLoading = false;
                state.password_update_status.error = null;
            })
            .addCase(updatePassword.rejected, (state, action) => {
                state.password_update_status.isLoading = false;
                state.password_update_status.error = action.payload;
            })
    },
});

export default ProfileSlice.reducer;