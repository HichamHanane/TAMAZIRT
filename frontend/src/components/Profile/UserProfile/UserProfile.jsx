import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Mail, User, Lock, Loader2, Save } from 'lucide-react';
import './UserProfile.css';
import { fetchUserProfile, updateUserProfile } from '../../../feature/ProfileSlice';
import { toast } from 'sonner';

const validationSchema = yup.object().shape({
    name: yup.string().required('Full name is required'),
    email: yup.string().email('Must be a valid email').required('Email is required'),
    current_password: yup.string(),
    new_password: yup.string()
        .min(8, 'Password must be at least 8 characters')
        .when('current_password', {
            is: (val) => val && val.length > 0,
            then: (schema) => schema.required('New password is required when changing password'),
            otherwise: (schema) => schema.nullable(true),
        }),
    confirm_password: yup.string()
        .when('new_password', {
            is: (val) => val && val.length > 0,
            then: (schema) => schema.oneOf([yup.ref('new_password'), null], 'Passwords must match'),
        }),
});

const UserProfile = () => {
    const dispatch = useDispatch();
    const { isUpdating, error } = useSelector(state => state.profile);
    const { user, isLoading } = useSelector(state => state.auth);

    const {
        control,
        handleSubmit,
        formState: { errors, isDirty },
        reset
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            name: user?.name || '',
            email: user?.email || '',
            current_password: '',
            new_password: '',
            confirm_password: '',
        },
    });

    useEffect(() => {
        dispatch(fetchUserProfile());
    }, [dispatch]);

    useEffect(() => {
        if (user) {
            reset({
                name: user?.name,
                email: user?.email,
                current_password: '',
                new_password: '',
                confirm_password: '',
            });
        }
    }, [user, reset]);

    const onSubmit = async (data) => {
        console.log('edit data :', data);
        console.log('auth user id :', user.id);
        try {
            let result = await dispatch(updateUserProfile({ data, id: user.id }))
            if (result.meta.requestStatus == "fulfilled") {
                toast.success('Profile Updated Successfully');
                return
            }
        } catch (error) {
            console.log('Error while submitting the edit form : ', error);

        }
    };

    if (isLoading) {
        return (
            <div className="profile-loading-state">
                <Loader2 size={40} className="spinner" />
                <p>Loading profile data...</p>
            </div>
        );
    }

    if (error && !user) {
        return (
            <div className="profile-error-state">
                <p>Error loading profile: {error}</p>
            </div>
        );
    }


    const profileInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'A';

    return (
        <div className="user-profile-page">
            <h1 className="profile-page-title">User Settings</h1>

            <form className="profile-form-card" onSubmit={handleSubmit(onSubmit)}>

                <div className="profile-header-section">
                    <div className="profile-avatar">{profileInitial}</div>
                    <div className="profile-info-summary">
                        <h2>{user?.name || 'Admin User'}</h2>
                        <p>{user?.email || 'admin@example.com'}</p>
                    </div>
                </div>

                <div className="profile-form-grid">

                    {/* --- Section Identity --- */}
                    <div className="form-section identity-section">
                        <h3>Identity Information</h3>

                        {/* Full Name */}
                        <div className="form-group-profile">
                            <label htmlFor="name">Full Name</label>
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <div className={`input-container-profile ${errors.name ? 'input-error' : ''}`}>
                                        <User size={18} className="input-icon-profile" />
                                        <input {...field} type="text" id="name" />
                                    </div>
                                )}
                            />
                            {errors.name && <p className="error-message-profile">{errors.name.message}</p>}
                        </div>

                        {/* Email Address */}
                        <div className="form-group-profile">
                            <label htmlFor="email">Email Address</label>
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <div className={`input-container-profile ${errors.email ? 'input-error' : ''}`}>
                                        <Mail size={18} className="input-icon-profile" />
                                        <input {...field} type="email" id="email" />
                                    </div>
                                )}
                            />
                            {errors.email && <p className="error-message-profile">{errors.email.message}</p>}
                        </div>
                    </div>

                    {/* --- Section Password --- */}
                    <div className="form-section password-section">
                        <h3>Change Password</h3>

                        {/* Current Password */}
                        <div className="form-group-profile">
                            <label htmlFor="current_password">Current Password</label>
                            <Controller
                                name="current_password"
                                control={control}
                                render={({ field }) => (
                                    <div className={`input-container-profile ${errors.current_password ? 'input-error' : ''}`}>
                                        <Lock size={18} className="input-icon-profile" />
                                        <input {...field} type="password" id="current_password" placeholder="Enter current password (if changing)" />
                                    </div>
                                )}
                            />
                            {errors.current_password && <p className="error-message-profile">{errors.current_password.message}</p>}
                        </div>

                        {/* New Password */}
                        <div className="form-group-profile">
                            <label htmlFor="new_password">New Password</label>
                            <Controller
                                name="new_password"
                                control={control}
                                render={({ field }) => (
                                    <div className={`input-container-profile ${errors.new_password ? 'input-error' : ''}`}>
                                        <Lock size={18} className="input-icon-profile" />
                                        <input {...field} type="password" id="new_password" placeholder="Enter new password (min 8 characters)" />
                                    </div>
                                )}
                            />
                            {errors.new_password && <p className="error-message-profile">{errors.new_password.message}</p>}
                        </div>

                        {/* Confirm New Password */}
                        <div className="form-group-profile">
                            <label htmlFor="confirm_password">Confirm New Password</label>
                            <Controller
                                name="confirm_password"
                                control={control}
                                render={({ field }) => (
                                    <div className={`input-container-profile ${errors.confirm_password ? 'input-error' : ''}`}>
                                        <Lock size={18} className="input-icon-profile" />
                                        <input {...field} type="password" id="confirm_password" placeholder="Confirm new password" />
                                    </div>
                                )}
                            />
                            {errors.confirm_password && <p className="error-message-profile">{errors.confirm_password.message}</p>}
                        </div>
                    </div>
                </div>

                {/* Messages de statut */}
                {error && <p className="status-message error">{error}</p>}

                {/* Bouton de soumission */}
                <div className="profile-action-footer">
                    <button type="submit" className="save-button" disabled={isUpdating || !isDirty}>
                        {isUpdating ? (
                            <>
                                <Loader2 size={20} className="spinner" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={20} />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserProfile;