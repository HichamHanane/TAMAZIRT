import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Lock, Loader2 } from 'lucide-react';
import './UpdatePasswordCard.css';
import { updatePassword } from '../../../feature/ProfileSlice';

const passwordSchema = yup.object({
    current_password: yup.string().required('Current password is required'),
    password: yup.string()
        .min(8, 'New password must be at least 8 characters')
        .required('New password is required'),
    password_confirmation: yup.string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required'),
}).required();


const UpdatePasswordCard = () => {
    const dispatch = useDispatch();
    const { isLoading: isUpdatingPassword } = useSelector(state => state.profile.password_update_status);
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(passwordSchema),
        defaultValues: {
            current_password: '',
            password: '',
            password_confirmation: '',
        },
    });

    const onSubmit = async (data) => {
        console.log('data before sent to the slice :', data);

        try {
            const result = await dispatch(updatePassword(data));
            if (result.meta.requestStatus === "fulfilled") {
                toast.success('Password updated successfully!');
                reset();
            } else {
                const errorMessage = result.payload || 'Failed to update password.';
                toast.error(errorMessage);
            }
        } catch (error) {
            console.error('Password update error:', error);
            toast.error('An unexpected error occurred.');
        }
    };

    return (
        <div className="update-password-card">
            <h3 className="update-password-title">Update Password</h3>
            <p className="update-password-subtitle">
                Ensure your account is secure by using a strong, unique password.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="update-password-form">
                <div className="form-group">
                    <label htmlFor="current_password">Current Password</label>
                    <input
                        id="current_password"
                        type="password"
                        {...register('current_password')}
                        className={errors.current_password ? 'input-error' : ''}
                    />
                    {errors.current_password && <p className="error-message">{errors.current_password.message}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="password">New Password</label>
                    <input
                        id="password"
                        type="password"
                        {...register('password')}
                        className={errors.new_password ? 'input-error' : ''}
                    />
                    {errors.password && <p className="error-message">{errors.password.message}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="password_confirmation">Confirm New Password</label>
                    <input
                        id="password_confirmation"
                        type="password"
                        {...register('password_confirmation')}
                        className={errors.confirm_password ? 'input-error' : ''}
                    />
                    {errors.password_confirmation && <p className="error-message">{errors.password_confirmation.message}</p>}
                </div>

                <button
                    type="submit"
                    className="update-password-btn"
                    disabled={isUpdatingPassword}
                >
                    {isUpdatingPassword ? (
                        <>
                            <Loader2 size={18} className="spinner" /> Updating...
                        </>
                    ) : (
                        <>
                            <Lock size={18} /> Update Password
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default UpdatePasswordCard;