import { Mail, Lock, Eye, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import loginImage from '../../assets/IMG_3755.webp';
import './LoginPage.css';
import { SignIn } from '../../feature/AuthSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

const validationSchema = yup.object().shape({
    email: yup.string()
        .email('Invalid email format.')
        .required('Email is required.'),

    password: yup.string()
        .required('Password is required.')
});

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = async (data) => {
        try {
            console.log('Form Data Validated and Ready for API:', data);

            let result = await dispatch(SignIn(data));

            if (result.meta.requestStatus == "fulfilled") {
                navigate('/')
                toast.success('You Successfully Logged in');
                return
            }
        } catch (error) {
            console.error('Submission Error:', error);
        }
    };


    return (
        <div className="login-final-container">

            <div className="login-final-visual-panel">
                <img
                    src={loginImage}
                    alt="Traditional Moroccan Courtyard"
                    className="login-final-image"
                />
            </div>

            <div className="login-final-form-panel">

                <div className="login-final-card">

                    <h1 className="login-final-logo">TAMAZIRT</h1>
                    <h2 className="login-final-welcome">Welcome Back</h2>
                    <p className="login-final-subtitle">
                        Log in to your account to continue your journey.
                    </p>

                    <form className="login-final-form-body" onSubmit={handleSubmit(onSubmit)}>

                        <label className="form-group-final">
                            <span className="form-label-final">Email Address</span>
                            <div className="input-container-final">
                                <Mail size={18} className="input-icon-final" />
                                <input
                                    className="form-input-final"
                                    placeholder="Enter your email"
                                    type="email"
                                    {...register('email')}
                                />
                            </div>
                            {errors.email && <p className="error-message">{errors.email.message}</p>}
                        </label>

                        <label className="form-group-final">
                            <div className="label-wrapper-final">
                                <span className="form-label-final">Password</span>
                            </div>
                            <div className="input-container-final">
                                <Lock size={18} className="input-icon-final" />
                                <input
                                    className="form-input-final"
                                    placeholder="Enter your password"
                                    type="password"
                                    {...register('password')}
                                />
                                <div className="password-toggle-final">
                                    <Eye size={18} className="password-icon-final" />
                                </div>
                            </div>
                            {errors.password && <p className="error-message">{errors.password.message}</p>}
                        </label>

                        <button
                            type="submit"
                            className="primary-button-final login-final-button"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Logging in...' : 'Login'}
                        </button>



                    </form>


                    <div className="login-final-footer-links">
                        <p>
                            Don't have an account?
                            <Link to='/register' className='signup-link'>Sign up</Link>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default LoginPage;