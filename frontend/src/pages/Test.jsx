import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../feature/AuthSlice';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

function Test() {
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogout = async () => {

        try {
            let result = await dispatch(logoutUser());
            if (result.meta.requestStatus == "fulfilled") {
                navigate('/')
                toast.success('You Successfully Logged out');
                return
            }
        } catch (error) {
            console.log("Error while logging out the use : ", error);

        }
    }
    return (
        <div>
            <h1>Hello {user?.name}</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}

export default Test;
