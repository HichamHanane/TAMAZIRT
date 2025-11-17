import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { X, MapPin, Calendar, Users, Send } from 'lucide-react';
import './SendRequestModal.css';

import default_image from '../../../assets/vector-flat-illustration-grayscale-avatar-user-profile-person-icon-profile-picture-business-profile-woman-suitable-social-media-profiles-icons-screensavers-as-templatex9_.avif'
import { useDispatch, useSelector } from 'react-redux';
import { sendNavigatorRequest } from '../../../feature/GuideSlice';
import { toast } from 'sonner';

const base_url = import.meta.env.VITE_BACKEND_BASE_URL


const today = new Date();
today.setHours(0, 0, 0, 0);

const requestSchema = yup.object().shape({
    navigator_id: yup
        .number()
        .required('Navigator ID is required.'),

    destination: yup
        .string()
        .required('Destination is required.')
        .max(255, 'Destination cannot exceed 255 characters.'),

    number_of_people: yup
        .number()
        .typeError('Number of people must be a valid number.')
        .required('Number of people is required.')
        .min(1, 'You must request for at least one person.')
        .max(50, 'Maximum 50 people allowed in one request.'),

    date: yup
        .date()
        .typeError('Date is required.')
        .required('Date is required.')

        .min(today, 'The date must be today or a future date.'),

    message: yup
        .string()
        .max(1000, 'Message cannot exceed 1000 characters.')
        .nullable(),
});


const SendRequestModal = ({ guide, onClose }) => {
    const dispatch = useDispatch();
    const { error, isLoading } = useSelector(state => state.guides.sent_request)
    if (!guide) return null;

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: yupResolver(requestSchema),
        defaultValues: {
            navigator_id: guide.user.id,
            destination: '',
            number_of_people: 1,
            date: '',
            message: '',
        }
    });


    const guideName = guide.user.name;

    const onSubmit = async (data) => {
        

        try {
            console.log('data to sent to the backend :', data);

            let result = await dispatch(sendNavigatorRequest(data));

            if (result.meta.requestStatus === "fulfilled") {
                onClose();
                toast.success('Your request is sent succesfully');
            }
            else {
                toast.error(error)
                console.log('the backend is return an error :', error);

            }

        } catch (error) {
            console.log('error while dispatching the function to sent a request to guide :', error);

        }
    };

    return (
        <div className="request-modal-backdrop" onClick={onClose}>
            <div className="request-modal-content" onClick={(e) => e.stopPropagation()}>

                <button className="request-modal-close-btn" onClick={onClose}>
                    <X size={24} />
                </button>

                <div className="request-modal-header">
                    <div className="request-guide-avatar-circle">
                        <img
                            src={guide.profile_picture_url ? `${base_url}${guide.profile_picture_url}` : default_image}
                            alt={`Guide ${guideName}`}
                        />
                    </div>

                    <h2 className="request-modal-title">Send a Request to {guideName}</h2>
                    <p className="request-modal-subtitle">They'll get back to you within 24 hours.</p>
                </div>

                <form className="request-form" onSubmit={handleSubmit(onSubmit)}>

                    <input type="hidden" {...register('navigator_id')} />

                    <div className="request-form-group">
                        <label className="request-form-label" htmlFor="destination">Destination</label>
                        <div className="request-input-with-icon">
                            <MapPin size={18} className="request-input-icon" />
                            <input
                                type="text"
                                id="destination"
                                placeholder="e.g., Marrakech Souks"
                                {...register('destination')}
                            />
                        </div>
                        {errors.destination && <p className="request-error-message">{errors.destination.message}</p>}
                    </div>

                    <div className="request-form-group-row">
                        <div className="request-form-group">
                            <label className="request-form-label" htmlFor="number_of_people">Number of Persons</label>
                            <div className="request-input-with-icon">
                                <Users size={18} className="request-input-icon" />
                                <input
                                    type="number"
                                    id="number_of_people"
                                    placeholder="e.g., 2"
                                    min="1"
                                    {...register('number_of_people', { valueAsNumber: true })}
                                />
                            </div>
                            {errors.number_of_people && <p className="request-error-message">{errors.number_of_people.message}</p>}
                        </div>

                        <div className="request-form-group">
                            <label className="request-form-label" htmlFor="date">Date</label>
                            <div className="request-input-with-icon">
                                <Calendar size={18} className="request-input-icon" />
                                <input
                                    type="date"
                                    id="date"
                                    min={new Date().toISOString().split('T')[0]}
                                    {...register('date')}
                                />
                            </div>
                            {errors.date && <p className="request-error-message">{errors.date.message}</p>}
                        </div>
                    </div>

                    <div className="request-form-group">
                        <label className="request-form-label" htmlFor="message">Your Message</label>
                        <textarea
                            id="message"
                            rows="4"
                            placeholder="Add any special requests or questions..."
                            className="request-form-textarea"
                            {...register('message')}
                        ></textarea>
                        {errors.message && <p className="request-error-message">{errors.message.message}</p>}
                    </div>



                    <button
                        type="submit"
                        className="btn-send-request"
                        disabled={isSubmitting || isLoading}
                    >
                        {isSubmitting || isLoading ? 'Sending...' : 'Send Request'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SendRequestModal;