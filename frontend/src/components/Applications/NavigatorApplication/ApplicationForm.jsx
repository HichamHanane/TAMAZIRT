import React from 'react';
import { User, Mail, MapPin, Phone, MessageSquare, Briefcase } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import './NavigatorApplication.css';
import { useDispatch, useSelector } from 'react-redux';
import { sentApplication } from '../../../feature/ApplicationSlice';
import { toast } from 'sonner';


const validationSchema = yup.object().shape({
    full_name: yup.string()
        .required('Full Name is required.')
        .max(255, 'Full Name cannot exceed 255 characters.'),

    email: yup.string()
        .email('Invalid email address.')
        .required('Email Address is required.'),

    phone_number: yup.string()
        .required('Phone Number is required.')
        .max(20, 'Phone Number cannot exceed 20 characters.'),

    city: yup.string()
        .max(255, 'City name cannot exceed 255 characters.')
        .nullable(),

    motivation: yup.string()
        .max(1000, 'Motivation text cannot exceed 1000 characters.')
        .nullable(),
});

const NavigatorApplication = () => {
    const { isLoading, error } = useSelector(state => state.applications.sentApplication)
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = async (data) => {
        try {
            console.log('Application Data Validated and Ready for API:', data);

            let result = await dispatch(sentApplication(data));

            console.log('Sent application Result :', result);

            if (result.meta.requestStatus == "fulfilled") {
                navigate('/')
                toast.success('Your Application Sent');
                return
            }

        } catch (error) {
            console.error('Error while Submitting new application form :', error);
        }
    };
    return (
        <div className="app-container">

            <div className="app-header-nav">
                <Link to="/" className="app-logo">TAMAZIRT</Link>
            </div>

            <div className="navigator-app-main">

                <div className="app-content-panel">

                    <h1 className="app-main-title">
                        Become a Navigator of <br />
                        Moroccan Culture.
                    </h1>

                    <div className="app-features-list">

                        <div className="app-feature-item">
                            <Briefcase size={20} className="feature-icon" />
                            <h3 className="feature-title">Connect with Global Travelers</h3>
                            <p className="feature-description">
                                Share your passion for Moroccan culture and create unforgettable experiences.
                            </p>
                        </div>

                        <div className="app-feature-item">
                            <Briefcase size={20} className="feature-icon" />
                            <h3 className="feature-title">Earn Competitively</h3>
                            <p className="feature-description">
                                Set your own schedule and get rewarded for your unique knowledge and hospitality.
                            </p>
                        </div>

                        <div className="app-feature-item">
                            <Briefcase size={20} className="feature-icon" />
                            <h3 className="feature-title">Join a Community</h3>
                            <p className="feature-description">
                                Be part of a curated network of Morocco's best local guides and cultural experts.
                            </p>
                        </div>
                    </div>

                    <div className="app-content-footer">
                        <p>© 2024 TAMAZIRT. All rights reserved.</p>
                    </div>

                </div>

                <div className="app-form-panel">

                    <div className="app-form-card">

                        <h2 className="app-form-title">
                            Apply to be a TAMAZIRT Navigator
                        </h2>
                        <p className="app-form-subtitle">
                            Fill in the details below to start your journey with us.
                        </p>

                        <form className="app-form-body" onSubmit={handleSubmit(onSubmit)}>

                            <div className="form-group-app">
                                <User size={18} className="input-icon-app" />
                                <input
                                    className="form-input-app"
                                    placeholder="Full Name"
                                    type="text"
                                    {...register('full_name')}
                                />
                            </div>
                            {errors.full_name && <p className="error-message">{errors.full_name.message}</p>}

                            <div className="form-group-app">
                                <Mail size={18} className="input-icon-app" />
                                <input
                                    className="form-input-app"
                                    placeholder="Email Address"
                                    type="email"
                                    {...register('email')}
                                />
                            </div>
                            {errors.email && <p className="error-message">{errors.email.message}</p>}

                            <div className="form-group-app">
                                <MapPin size={18} className="input-icon-app" />
                                <input
                                    className="form-input-app"
                                    placeholder="City"
                                    type="text"
                                    {...register('city')}
                                />
                            </div>
                            {errors.city && <p className="error-message">{errors.city.message}</p>}

                            <div className="form-group-app">
                                <Phone size={18} className="input-icon-app" />
                                <input
                                    className="form-input-app"
                                    placeholder="Phone Number"
                                    type="tel"
                                    {...register('phone_number')}
                                />
                            </div>
                            {errors.phone_number && <p className="error-message">{errors.phone_number.message}</p>}

                            <div className="form-group-app textarea-group">
                                <MessageSquare size={18} className="input-icon-app textarea-icon" />
                                <textarea
                                    className="form-textarea-app"
                                    placeholder="Tell us why you'd be a great navigator..."
                                    rows="5"
                                    {...register('motivation')}
                                ></textarea>
                            </div>
                            {errors.motivation && <p className="error-message">{errors.motivation.message}</p>}

                            <button
                                type="submit"
                                className="submit-button-app"
                                disabled={isSubmitting}
                            >
                                {isSubmitting && isLoading ? 'Submitting...' : 'Submit Application'}
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavigatorApplication;