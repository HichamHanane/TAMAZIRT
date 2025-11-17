import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { X, User, Mail, Lock, Home } from 'lucide-react';
import './AddNavigatorModal.css';

import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { addNewNavigator } from '../../../feature/NavigatorSlice';
import { toast } from 'sonner';

const navigatorSchema = yup.object().shape({
    full_name: yup
        .string()
        .required("Full Name is required."),
    email: yup
        .string()
        .email("Email must be valid.")
        .required("Email is required."),
    password: yup
        .string()
        .min(8, "Password must be at least 8 characters.")
        .required("Password is required."),
    city: yup
        .string()
        .required("City is required."),
});

const AddNavigatorModal = ({ isOpen, onClose, onAddNavigator }) => {
    const { isLoading, error } = useSelector(state => state.navigators.add_navigator)
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm({
        resolver: yupResolver(navigatorSchema),
    });

    if (!isOpen) return null;

    const onSubmit = async (data) => {
        try {
            let result = await dispatch(addNewNavigator(data));
            if (result.meta.requestStatus == "fulfilled") {
                reset();
                onClose();
                toast.success('New Navigator Created SuccessFully');
                return
            }

        } catch (error) {
            console.log('Error while submitting the form add new navigator : ', error);
            reset();
            // onClose();
        }
        // onAddNavigator(data);
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2 className="modal-title">Add New Navigator</h2>
                    <button className="modal-close-btn" onClick={handleClose}>
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="modal-form">

                    <div className="form-group">
                        <label htmlFor="fullName">Full Name</label>
                        <div className="input-with-icon">
                            <User size={18} className="input-icon" />
                            <input
                                type="text"
                                id="fullName"
                                placeholder="e.g., Fatima Zahra"
                                {...register("full_name")}
                                className={errors.fullName ? 'input-error' : ''}
                            />
                        </div>
                        {errors.full_name && <p className="add-navigator-error-message">{errors.full_name.message}</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <div className="input-with-icon">
                            <Mail size={18} className="input-icon" />
                            <input
                                type="email"
                                id="email"
                                placeholder="e.g., fatima.z@email.com"
                                {...register("email")}
                                className={errors.email ? 'input-error' : ''}
                            />
                        </div>
                        {errors.email && <p className="add-navigator-error-message">{errors.email.message}</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-with-icon">
                            <Lock size={18} className="input-icon" />
                            <input
                                type="password"
                                id="password"
                                placeholder="Enter a secure password"
                                {...register("password")}
                                className={errors.password ? 'input-error' : ''}
                            />
                        </div>
                        {errors.password && <p className="add-navigator-error-message">{errors.password.message}</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="city">City</label>
                        <div className="input-with-icon">
                            <Home size={18} className="input-icon" />
                            <input
                                type="text"
                                id="city"
                                placeholder="e.g., Marrakech"
                                {...register("city")}
                                className={errors.city ? 'input-error' : ''}
                            />
                        </div>
                        {errors.city && <p className="add-navigator-error-message">{errors.city.message}</p>}
                    </div>

                    {error && <p className="add-navigator-error-message">{error}</p>}
                    <div className="modal-actions">
                        <button type="button" className="add-navigator-cancel-btn" onClick={handleClose} disabled={isSubmitting}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="add-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting && isLoading ? 'Adding...' : 'Add Navigator'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddNavigatorModal;