import axios from 'axios';
import Cookies from 'js-cookie';


const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',
    headers: {
        // 'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    
});

/**
 * Intercepts every outgoing request and checks the cookie for the authentication token.
 */
api.interceptors.request.use(
    (config) => {
        const token = Cookies.get('authToken');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


// ----------------- Response Interceptor (Simplified) -----------------
// We keep the response interceptor simple or remove the Redux dependency here
// If the token is invalid (401), we rely on the component (or a dedicated listener) 
// to see the error and call the Redux 'logout' action.


// Response Interceptor: Handle 401 Unauthorized errors (optional, but good practice)
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // Token expired/invalid. Dispatch a global logout action.
        // useDispatch(logoutUser()); 
        console.error('Unauthorized (401). Token cleared from Redux.');
        // You might add navigation logic here: window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );


// Note: We don't need the setupAxiosInterceptors function anymore
// because the interceptor doesn't need to access the Redux store directly.

export default api;