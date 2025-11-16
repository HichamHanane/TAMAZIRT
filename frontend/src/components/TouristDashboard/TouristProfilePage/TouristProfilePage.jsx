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
        .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
}).required();

const TouristProfilePage = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { tourist_profile, password_update_status } = useSelector(state => state.profile);
    // const { profile, isLoading, error } = useSelector(state => state.touristProfile); // Supposons un slice touristProfile


    const [loading, setLoading] = useState(false);

    const {
        register: registerPersonalInfo,
        handleSubmit: handleSubmitPersonalInfo,
        formState: { errors: personalInfoErrors, isSubmitting: isSubmittingPersonalInfo },
        reset: resetPersonalInfo
    } = useForm({
        resolver: yupResolver(personalInfoSchema),
        defaultValues: {
            name: user?.name,
            email: user?.email,
        }
    });

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

            {/* --- Section Informations Personnelles --- */}
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
                        <img src={user?.avatar || default_image} alt="Profile" className="t-profile-avatar" />
                        <div>
                            <button type="button" className="t-profile-change-photo-btn">Change Photo</button>
                            <p className="t-profile-photo-info">JPG, GIF or PNG. 1MB max.</p>
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

            {/* --- Section Sécurité du Compte --- */}
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