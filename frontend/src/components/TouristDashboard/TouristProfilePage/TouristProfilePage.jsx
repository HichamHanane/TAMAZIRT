import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { User, Lock, Loader2 } from 'lucide-react';
import './TouristProfilePage.css';
import { useSelector, useDispatch } from 'react-redux';
import default_image from '../../../assets/vector-flat-illustration-grayscale-avatar-user-profile-person-icon-profile-picture-business-profile-woman-suitable-social-media-profiles-icons-screensavers-as-templatex9_.avif'
import { updatePassword, updateTouristProfile } from '../../../feature/ProfileSlice';
import { toast } from 'sonner';

const personalInfoSchema = yup.object({
    name: yup.string().required('Full Name is required').min(3, 'Full Name must be at least 3 characters'),
    email: yup.string().email('Invalid email address').required('Email is required'),
}).required();


const accountSecuritySchema = yup.object({
    currentPassword: yup.string().required('Current Password is required'),
    newPassword: yup.string()
        .required('New Password is required')
        .min(8, 'Password must be at least 8 characters'),
    newPasswordConfirmation: yup.string()
        .required('Confirm Password is required')
        .oneOf([yup.ref('newPassword'), null], 'Passwords must match'),
    avatar: yup.mixed()
        .test('fileSize', 'The file size is too large (max 1MB)', (value) => {
            return !value || !(value.size > 1024 * 1024); // 1MB limit
        })
        .nullable(),
}).required();

const TouristProfilePage = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { tourist_profile, password_update_status } = useSelector(state => state.profile);

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const [loading, setLoading] = useState(false);

    const {
        register: registerPersonalInfo,
        handleSubmit: handleSubmitPersonalInfo,
        formState: { errors: personalInfoErrors, isSubmitting: isSubmittingPersonalInfo },
        reset: resetPersonalInfo,
        setValue: setValuePersonalInfo
    } = useForm({
        resolver: yupResolver(personalInfoSchema),
        defaultValues: {
            name: user?.name,
            email: user?.email,
            avatar: null,
        }
    });
    const avatarRegister = registerPersonalInfo('avatar');

    useEffect(() => {
        resetPersonalInfo({
            name: user?.name,
            email: user?.email,
            avatar: null,
        });
    }, [user, resetPersonalInfo]);

    const {
        register: registerAccountSecurity,
        handleSubmit: handleSubmitAccountSecurity,
        formState: { errors: accountSecurityErrors, isSubmitting: isSubmittingAccountSecurity },
        reset: resetAccountSecurity

    } = useForm({
        resolver: yupResolver(accountSecuritySchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            newPasswordConfirmation: '',
        }
    });

    // cleanup blob URLs on change/unmount 
    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }

            const objectUrl = URL.createObjectURL(file);
            setSelectedFile(file);
            setPreviewUrl(objectUrl);
            setValuePersonalInfo('avatar', file, { shouldValidate: true });
        }
    };


    const onPersonalInfoSubmit = async (data) => {
        try {
            let result = await dispatch(updateTouristProfile(data));
            if (result.meta.requestStatus === "fulfilled") {
                toast.success('Profile updated successfully');
                return
            }
        } catch (error) {
            console.log('error while submitting update email , name form : ', error);

        }
        console.log('Personal Info Data:', data);
    };

    const onAccountSecuritySubmit = async (data) => {
        console.log('Account Security Data:', data);

        const payload = {
            current_password: data.currentPassword,
            password: data.newPassword,
            password_confirmation: data.newPasswordConfirmation,
        }

        const result = await dispatch(updatePassword(payload));
        if (result.meta.requestStatus === "fulfilled") {
            toast.success('Password updated successfully');
            return
        }
    };

    const getProfileImageSrc = () => {
        if (previewUrl) return previewUrl;

        const currentPictureUrl = user?.avatar_url;
        const defaultPictureUrl = default_image;

        if (!currentPictureUrl) return defaultPictureUrl;

        if (/^https?:\/\//i.test(currentPictureUrl)) return currentPictureUrl;
        
        const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL.replace(/\/$/, '');
        return `${baseUrl}${currentPictureUrl.startsWith('/') ? '' : '/'}${currentPictureUrl}`;
    };

    if (loading) {
        return (
            <div className="t-profile-container" style={{ textAlign: 'center', padding: '50px' }}>
                <Loader2 size={30} className="t-profile-loader-spin" />
                <p>Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="t-profile-container">
            <div className="t-profile-page-header">
                <h1 className="t-profile-page-title">My Profile</h1>
                <p className="t-profile-page-subtitle">Manage your personal information and account settings.</p>
            </div>

            <div className="t-profile-section-card">
                <div className="t-profile-section-header">
                    <h2 className="t-profile-section-title">Personal Information</h2>
                    <p className="t-profile-section-description">Update your photo and personal details here.</p>
                </div>

                <form onSubmit={handleSubmitPersonalInfo(onPersonalInfoSubmit)} className="t-profile-form">
                    <div className="t-profile-actions-header">
                        <button type="submit" className="t-profile-btn-primary" disabled={isSubmittingPersonalInfo}>
                            {isSubmittingPersonalInfo && tourist_profile.isLoading ? <Loader2 size={18} className="t-profile-loader-spin" /> : 'Save Changes'}
                        </button>
                    </div>

                    <div className="t-profile-photo-upload">
                        <img src={getProfileImageSrc()} alt="Profile" className="t-profile-avatar" />

                        <div>
                            <label htmlFor="avatar-upload-input">
                                <span className="t-profile-change-photo-btn" role="button" tabIndex={0}>
                                    Change Photo
                                </span>

                                <input
                                    id="avatar-upload-input"
                                    type="file"
                                    style={{ display: 'none' }}
                                    accept="image/jpeg,image/png,image/gif"
                                    {...avatarRegister}
                                    onChange={(e) => {
                                        avatarRegister?.onChange?.(e);
                                        handleFileChange(e);
                                    }}
                                />
                            </label>

                            <p className="t-profile-photo-info">JPG, GIF or PNG. 1MB max.</p>

                            {personalInfoErrors.avatar && <p className="t-error-message">{personalInfoErrors.avatar.message}</p>}
                        </div>
                    </div>

                    <div className="t-profile-form-grid">
                        <div className="t-form-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                                id="name"
                                type="text"
                                {...registerPersonalInfo('name')}
                                className={personalInfoErrors.fullName ? 't-input-error' : ''}
                            />
                            {personalInfoErrors.name && <p className="t-error-message">{personalInfoErrors.name.message}</p>}
                        </div>

                        <div className="t-form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                {...registerPersonalInfo('email')}
                                className={personalInfoErrors.emailAddress ? 't-input-error' : ''}
                            />
                            {personalInfoErrors.email && <p className="t-error-message">{personalInfoErrors.email.message}</p>}
                        </div>


                    </div>
                </form>
            </div>

            <div className="t-profile-section-card">
                <div className="t-profile-section-header">
                    <h2 className="t-profile-section-title">Account Security</h2>
                    <p className="t-profile-section-description">Update your password for better security.</p>
                </div>

                <form onSubmit={handleSubmitAccountSecurity(onAccountSecuritySubmit)} className="t-profile-form">
                    <div className="t-profile-form-grid">
                        <div className="t-form-group">
                            <label htmlFor="currentPassword">Current Password</label>
                            <input
                                id="currentPassword"
                                type="password"
                                {...registerAccountSecurity('currentPassword')}
                                className={accountSecurityErrors.currentPassword ? 't-input-error' : ''}
                            />
                            {accountSecurityErrors.currentPassword && <p className="t-error-message">{accountSecurityErrors.currentPassword.message}</p>}
                        </div>

                        <div className="t-form-group">
                            <label htmlFor="newPassword">New Password</label>
                            <input
                                id="newPassword"
                                type="password"
                                {...registerAccountSecurity('newPassword')}
                                className={accountSecurityErrors.newPassword ? 't-input-error' : ''}
                            />
                            {accountSecurityErrors.newPassword && <p className="t-error-message">{accountSecurityErrors.newPassword.message}</p>}
                        </div>
                        <div className="t-form-group">
                            <label htmlFor="newPasswordConfirmation">Confirm New Password</label>
                            <input
                                id="newPasswordConfirmation"
                                type="password"
                                {...registerAccountSecurity('newPasswordConfirmation')}
                                className={accountSecurityErrors.newPasswordConfirmation ? 't-input-error' : ''}
                            />
                            {accountSecurityErrors.newPasswordConfirmation && <p className="t-error-message">{accountSecurityErrors.newPasswordConfirmation.message}</p>}
                        </div>
                    </div>

                    <div className="t-profile-password-actions">
                        <button
                            type="submit"
                            className="t-profile-btn-primary"
                            disabled={isSubmittingAccountSecurity || password_update_status.isLoading}
                        >
                            {isSubmittingAccountSecurity || password_update_status.isLoading ? (
                                <Loader2 size={18} className="t-profile-loader-spin" />
                            ) : (
                                'Update Password'
                            )}
                        </button>
                    </div>
                    {password_update_status.error && (
                        <p className="t-error-message t-api-error">{password_update_status.error}</p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default TouristProfilePage;