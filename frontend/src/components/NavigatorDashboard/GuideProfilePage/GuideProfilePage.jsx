import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Save, Pencil, Loader2, UserStar, Star } from 'lucide-react';
import './GuideProfilePage.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNavigatorProfile, updateNavigatorProfile } from '../../../feature/ProfileSlice';
import { toast } from 'sonner';
import UpdatePasswordCard from '../UpdatePasswordCard/UpdatePasswordCard';

const profileSchema = yup.object({
    name: yup.string().required('Full Name is required').min(3, 'Full Name must be at least 3 characters'),
    emailAddress: yup.string().email('Invalid email address').required('Email is required'),
    phone_number: yup.string()
        .required('Phone Number is required'),
    bio: yup.string()
        .required('Bio is required')
        .min(50, 'Bio must be at least 50 characters')
        .max(500, 'Bio cannot exceed 500 characters'),
    city: yup.string().required('City is required'),
    languages: yup.string().required('Languages are required (e.g., English, Spanish)'),
}).required();

const GuideProfilePage = () => {
    const { error, profile, isLoading } = useSelector(state => state.profile.user_profile);
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const [fileToUpload, setFileToUpload] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);


    const initialProfileData = {
        name: profile?.user?.name,
        emailAddress: profile?.user?.email,
        phone_number: profile?.phone_number || null,
        bio: profile?.bio || null,
        city: profile?.city,
        languages: profile?.languages.join(', ') || '',
    };

    const { register, reset, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(profileSchema),
        defaultValues: initialProfileData,
    });

    const getProfileImageSrc = () => {
        if (previewUrl) {
            return previewUrl;
        }

        const currentPictureUrl = profile?.profile_picture_url;
        const defaultPictureUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2864&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

        if (!currentPictureUrl) {
            return defaultPictureUrl;
        }
        // Assuming existing logic requires prepending VITE_BACKEND_BASE_URL for relative paths 
        const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL.replace(/\/$/, '');
        return `${baseUrl}${currentPictureUrl}`;
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFileToUpload(file);

        if (file) {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setPreviewUrl(null);
        }
    };

    const onSubmit = async (data) => {
        const languagesArray = data.languages
            ? data.languages.split(',').map(lang => lang.trim()).filter(lang => lang)
            : [];

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.emailAddress);
        formData.append('phone_number', data.phone_number);
        formData.append('bio', data.bio);
        formData.append('city', data.city);

        languagesArray.forEach((lang, index) => {
            formData.append(`languages[${index}]`, lang);
        });

        if (fileToUpload) {
            formData.append('profile_picture', fileToUpload);
        }

        formData.append('_method', 'PUT');


        try {
            let result = await dispatch(updateNavigatorProfile({ payload: formData, id: profile?.id }));
            if (result.meta.requestStatus == "fulfilled") {
                setFileToUpload(null);
                setPreviewUrl(null);
                reset();
                toast.success('Navigator Updated SuccessFully');
                return
            }
        }
        catch (error) {
            console.log('Error while submitting the update navigator form : ', error);
        }

    };

    useEffect(() => {
        dispatch(fetchNavigatorProfile());
    }, [dispatch]);

    useEffect(() => {
        reset(initialProfileData);
    }, [profile, user, reset]);

    if (isLoading) {
        return (
            <div className="profile-loading-state">
                <Loader2 size={40} className="spinner" />
                <p>Loading profile data...</p>
            </div>
        );
    }

    if (error && !profile) {
        return (
            <div className="profile-error-state">
                <p>Error loading profile: {error}</p>
            </div>
        );
    }

    return (
        <div className="guide-profile-page">
            <div className="guide-profile_header">
                <div className="guide-profile-heading-group">
                    <h1 className="guide-profile-title">My Profile</h1>
                    <p className="guide-profile-subtitle">View and update your personal information.</p>
                </div>
            </div>

            <div className="guide-profile-content-wrapper">
                <div className="guide-profile-left-column">
                    <div className="guide-profile-card">
                        <div className="guide-profile-picture-container">
                            <img
                                src={getProfileImageSrc()}
                                alt="Profile"
                                className="guide-profile-picture"
                            />
                            <label
                                htmlFor="profile_picture_upload"
                                className="guide-edit-picture-btn"
                                title="Change profile picture"
                            >
                                <Pencil size={16} />
                                <input
                                    type="file"
                                    id="profile_picture_upload"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                />
                            </label>
                        </div>
                        <h2 className="guide-profile-name">{profile?.user?.name}</h2>
                        <p className="guide-profile-email">{profile?.user?.email}</p>
                        <div className="guide-profile-rating">
                            <Star size={16} fill="#FFD700" strokeWidth={0} />
                            <span>Average Review : {profile?.average_rating}</span>
                        </div>
                    </div>

                    <UpdatePasswordCard />

                </div>

                <div className="guide-personal-info-form-container">
                    <h3 className="guide-form-section-title">Personal Information</h3>
                    <form id="profile-form" onSubmit={handleSubmit(onSubmit)} className="guide-personal-info-form">
                        <div className="guide-form-grid">
                            <div className="guide-form-group guide-full-width">
                                <label htmlFor="name">Full Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    {...register('name')}
                                    className={errors.fullName ? 'input-error' : ''}
                                />
                                {errors.name && <p className="guide-profile-error-message">{errors.name.message}</p>}
                            </div>

                            <div className="guide-form-group guide-full-width">
                                <label htmlFor="emailAddress">Email Address</label>
                                <input
                                    id="emailAddress"
                                    type="email"
                                    {...register('emailAddress')}
                                    className={errors.emailAddress ? 'input-error' : ''}
                                />
                                {errors.emailAddress && <p className="guide-profile-error-message">{errors.emailAddress.message}</p>}
                            </div>

                            <div className="guide-form-group guide-full-width">
                                <label htmlFor="phone_number">Phone Number</label>
                                <input
                                    id="phone_number"
                                    type="tel"
                                    {...register('phone_number')}
                                    className={errors.phoneNumber ? 'input-error' : ''}
                                />
                                {errors.phone_number && <p className="guide-profile-error-message">{errors.phone_number.message}</p>}
                            </div>

                            <div className="guide-form-group guide-full-width">
                                <label htmlFor="bio">Bio</label>
                                <textarea
                                    id="bio"
                                    rows="5"
                                    {...register('bio')}
                                    className={errors.bio ? 'input-error' : ''}
                                />
                                {errors.bio && <p className="guide-profile-error-message">{errors.bio.message}</p>}
                            </div>

                            <div className="guide-form-group">
                                <label htmlFor="city">City</label>
                                <input
                                    id="city"
                                    type="text"
                                    {...register('city')}
                                    className={errors.city ? 'input-error' : ''}
                                />
                                {errors.city && <p className="guide-profile-error-message">{errors.city.message}</p>}
                            </div>

                            <div className="guide-form-group">
                                <label htmlFor="languages">Languages (Comma separated)</label>
                                <input
                                    id="languages"
                                    type="text"
                                    {...register('languages')}
                                    className={errors.languages ? 'input-error' : ''}
                                />
                                {errors.languages && <p className="guide-profile-error-message">{errors.languages.message}</p>}
                            </div>
                        </div>
                        <button
                            type="submit"
                            form="profile-form"
                            className="guide-save-changes-btn"
                            disabled={isSubmitting}
                        >
                            <Save size={18} />
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default GuideProfilePage;