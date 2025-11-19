import { User, Mail, Lock, Eye, Zap } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import registerImage from '../../assets/Casablanca-6954.webp';
import './RegisterPage.css';
import { SignIn, SignUp } from '../../feature/AuthSlice';
import { toast } from 'sonner';

const validationSchema = yup.object().shape({
    name: yup.string()
        .required('Full Name is required.')
        .max(255, 'Name cannot exceed 255 characters.'),

    email: yup.string()
        .email('Invalid email address.')
        .required('Email Address is required.')
        .max(255, 'Email cannot exceed 255 characters.'),

    password: yup.string()
        .required('Password is required.')
        .min(8, 'Password must be at least 8 characters.'),

    password_confirmation: yup.string()
        .required('Confirm Password is required.')
        .oneOf([yup.ref('password'), null], 'Passwords must match.'),
});


const RegisterPage = () => {
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

            let result = await dispatch(SignUp(data));

            if (result.meta.requestStatus == "fulfilled") {
                navigate('/login')
                toast.success('You Successfully Signed up');
                return
            }

        } catch (error) {
            console.error('Submission Error:', error);
        }
    };


    return (
        <div className="register-final-container">

            <div className="register-final-visual-panel">
                <img
                    src={registerImage}
                    alt="Traditional Moroccan Architecture"
                    className="register-final-image"
                />
            </div>

            <div className="register-final-form-panel">

                <div className="register-final-card">

                    <h1 className="register-final-logo">TAMAZIRT</h1>
                    <h2 className="register-final-welcome">Join the Journey</h2>
                    <p className="register-final-subtitle">
                        Create your account to start discovering Morocco with local experts.
                    </p>

                    <form className="register-final-form-body" onSubmit={handleSubmit(onSubmit)}>

                        <label className="form-group-final">
                            <span className="form-label-final">Full Name</span>
                            <div className="input-container-final">
                                <User size={18} className="input-icon-final" />
                                <input
                                    className="form-input-final"
                                    placeholder="Enter your full name"
                                    type="text"
                                    {...register('name')}
                                />
                            </div>
                            {errors.name && <p className="auth-error-message">{errors.name.message}</p>}
                        </label>

                        <label className="form-group-final">
                            <span className="form-label-final">Email Address</span>
                            <div className="input-container-final">
                                <Mail size={18} className="input-icon-final" />
                                <input
                                    className="form-input-final"
                                    placeholder="name@example.com"
                                    type="email"
                                    {...register('email')}
                                />
                            </div>
                            {errors.email && <p className="auth-error-message">{errors.email.message}</p>}
                        </label>

                        <label className="form-group-final">
                            <span className="form-label-final">Password</span>
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
                            {errors.password && <p className="auth-error-message">{errors.password.message}</p>}
                        </label>

                        <label className="form-group-final">
                            <span className="form-label-final">Confirm Password</span>
                            <div className="input-container-final">
                                <Lock size={18} className="input-icon-final" />
                                <input
                                    className="form-input-final"
                                    placeholder="Confirm your password"
                                    type="password"
                                    {...register('password_confirmation')}
                                />
                                <div className="password-toggle-final">
                                    <Eye size={18} className="password-icon-final" />
                                </div>
                            </div>
                            {errors.password_confirmation && <p className="auth-error-message">{errors.password_confirmation.message}</p>}
                        </label>

                        <button
                            type="submit"
                            className="primary-button-final register-final-button"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Registering...' : 'Register'}
                        </button>

                    </form>



                    <div className="register-final-footer-links">
                        <p>
                            Already have an account? <Link to='/login'>Login</Link>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default RegisterPage;