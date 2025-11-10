import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from 'js-cookie';
import { toast } from "sonner";
import api from "../utils/api/axios";


export const SignUp = createAsyncThunk('auth/signup', async (data, { rejectWithValue }) => {
    try {
        let response = await api.post('/register', data);
        console.log('Register response :', response);
        response.data;
    } catch (error) {
        console.log('Error while Sign up :', error);
        return rejectWithValue(error.response.data.message)

    }
});


export const SignIn = createAsyncThunk('auth/SignIn', async (data, { rejectWithValue }) => {
    console.log("Data :", data);
    try {
        let response = await api.post('/login', data)
        console.log('Login response :', response);
        Cookies.set('authToken', response.data.token, { expires: 7, sameSite: 'Strict' });
        return response.data;
    }
    catch (error) {
        console.log("Error while handling user login :", error);
        return rejectWithValue(error.response.data.message)
    }
})

export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.post('/logout');

            Cookies.remove('authToken');
            return response.data.message;

        } catch (error) {
            console.log('Error while log out the user :', error);
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchUser = createAsyncThunk('auth/fetchUser', async (_, { rejectWithValue }) => {
    try {

        let response = await api.get('/user');
        console.log('get user response :', response);
        return response.data
    } catch (error) {
        console.log('Error while get the user :', error.response.data.message);
        return rejectWithValue(error.response.data.message)

    }
});


const AuthSlice = createSlice({
    name: 'auth',
    initialState: {
        user_login: {
            isLoading: false,
            error: null
        },
        user_register: {
            isLoading: false,
            error: null
        },
        user_logout: {
            isLoading: false,
            error: null
        },
        user: null,
        isLoading: false,
        token: null,
        isAuthenticated: false,
        role: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Register
            .addCase(SignUp.pending, (state, action) => {
                console.log('register pending :', action);

                state.user_register.isLoading = true;
                state.user_register.error = null;
            })
            .addCase(SignUp.fulfilled, (state, action) => {
                console.log('register fufilled :', action);
                state.user_register.isLoading = false;
                // state.user = action.payload;
            })
            .addCase(SignUp.rejected, (state, action) => {
                console.log('register rjected :', action);
                state.user_register.isLoading = false;
                state.user_register.error = action.payload;
            })

            // login
            .addCase(SignIn.pending, (state, action) => {
                console.log('user login pending');
                state.user_login.isLoading = true;
                state.user_login.error = null;

            })
            .addCase(SignIn.fulfilled, (state, action) => {
                console.log('user login fulfilled : ', action);
                state.user_login.isLoading = false;
                state.user_login.error = null;

                state.user = action.payload.user;
                state.token = action.payload.token;
                state.role = action.payload.roles;
                state.isAuthenticated = true;
            })
            .addCase(SignIn.rejected, (state, action) => {
                console.log('user login rejected : ', action);
                state.user_login.isLoading = false;
                state.user_login.error = action.payload;
            })

            // logout
            .addCase(logoutUser.pending, (state) => {
                console.log('user login pending');
                state.user_logout.isLoading = true;
                state.user_logout.error = null;
                toast.loading('please wait...')
            })
            .addCase(logoutUser.fulfilled, (state, action) => {
                console.log('user login fulfilled : ', action);
                state.token = null;
                state.user = null;
                state.isAuthenticated = false;
                state.user_logout.isLoading = false;
                toast.dismiss()

            })
            .addCase(logoutUser.rejected, (state, action) => {
                console.log('user login rejected : ', action);
                state.token = null;
                state.user = null;
                state.isAuthenticated = false;
                state.user_logout.isLoading = false;
                state.user_logout.error = action.payload;
                toast.error(action.payload)
                toast.dismiss()

            })

            //Fetch user
            .addCase(fetchUser.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.role = action.payload.roles;
                state.isAuthenticated = true;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.isLoading = false;
                console.log('reject fetch user : ', action);
                state.user = null;
                state.error = action.payload
                state.isAuthenticated = false;

            })


    }
})


export default AuthSlice.reducer;