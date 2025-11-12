import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { X, User, Mail, Lock, Loader2 } from 'lucide-react';
import './AddTouristModal.css';
import { addNewTourist } from '../../../feature/touristsSlice';
import { toast } from 'sonner';

const validationSchema = yup.object().shape({
    name: yup.string().required('Full Name is required'),
    email: yup.string().email('Must be a valid email').required('Email is required'),
    password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),

});

const AddTouristModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const { isLoading, error } = useSelector(state => state.tourists);

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
    });

    if (!isOpen) return null;

    const onSubmit = async (data) => {
        try {
            let result = await dispatch(addNewTourist(data));
            if (result.meta.requestStatus == "fulfilled") {
                reset();
                onClose();
                toast.success('New Tourist Created SuccessFully');
                return
            }
        } catch (error) {
            console.log('Error while submitting add tourist form : ', error);

        }

    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content add-tourist-modal">
                <div className="modal-header">
                    <h2 className="modal-title">Add New Tourist</h2>
                    <button className="modal-close-btn" onClick={handleClose} disabled={isLoading}>
                        <X size={20} />
                    </button>
                </div>

                <form className="modal-form" onSubmit={handleSubmit(onSubmit)}>

                    {/* Nom Complet */}
                    <div className="form-group-modal">
                        <label className="form-label-modal" htmlFor="name">Full Name</label>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <div className={`input-container-modal ${errors.name ? 'input-error' : ''}`}>
                                    <User size={18} className="input-icon-modal" />
                                    <input {...field} placeholder="Enter full name" type="text" id="name" />
                                </div>
                            )}
                        />
                        {errors.name && <p className="error-message-modal">{errors.name.message}</p>}
                    </div>

                    {/* Email */}
                    <div className="form-group-modal">
                        <label className="form-label-modal" htmlFor="email">Email Address</label>
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <div className={`input-container-modal ${errors.email ? 'input-error' : ''}`}>
                                    <Mail size={18} className="input-icon-modal" />
                                    <input {...field} placeholder="Enter email address" type="email" id="email" />
                                </div>
                            )}
                        />
                        {errors.email && <p className="error-message-modal">{errors.email.message}</p>}
                    </div>

                    {/* Password */}
                    <div className="form-group-modal">
                        <label className="form-label-modal" htmlFor="password">Password</label>
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <div className={`input-container-modal ${errors.password ? 'input-error' : ''}`}>
                                    <Lock size={18} className="input-icon-modal" />
                                    <input {...field} placeholder="Enter password" type="password" id="password" />
                                </div>
                            )}
                        />
                        {errors.password && <p className="error-message-modal">{errors.password.message}</p>}
                    </div>
                    {error && <p className="error-message-modal api-error">{error}</p>}

                    <div className="modal-actions">
                        <button type="submit" className="primary-modal-btn" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={20} className="spinner" />
                                    Creating...
                                </>
                            ) : (
                                'Create Tourist'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTouristModal;