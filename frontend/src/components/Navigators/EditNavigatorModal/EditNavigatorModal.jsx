import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { X, User, Mail, Home, Phone, Briefcase, MapPin, Loader2 } from 'lucide-react';
import * as yup from 'yup';
import './EditNavigatorModal.css';
import { editNavigator } from '../../../feature/NavigatorSlice';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';

const editNavigatorSchema = yup.object().shape({
    full_name: yup.string().required("Le nom complet est requis."),
    email: yup.string().email("L'email doit être valide.").required("L'email est requis."),
    city: yup.string().required("La ville est requise."),
    phoneNumber: yup.string().nullable().max(20, "Le numéro de téléphone est trop long."),
    bio: yup.string().nullable().max(1000, "La biographie ne peut pas dépasser 1000 caractères."),
    languages: yup.string().nullable(),
    verified: yup.boolean().required("Le statut de vérification est requis."),
});

const EditNavigatorModal = ({ isOpen, onClose, navigator }) => {
    const dispatch = useDispatch();
    const { error, isLoading } = useSelector(state => state.navigators.edit_navigator)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm({
        resolver: yupResolver(editNavigatorSchema),
        defaultValues: {}
    });

    useEffect(() => {
        if (navigator) {
            reset({
                full_name: navigator.user?.name || '',
                email: navigator.user?.email || '',
                city: navigator.city || '',
                phoneNumber: navigator.phone_number || '',
                bio: navigator.bio || '',
                languages: navigator.languages?.join(', ') || '',
                verified: navigator.verified || false,
            });
        }
    }, [navigator, reset]);

    if (!isOpen || !navigator) return null;

    const onSubmit = async (data) => {
        const payload = {
            id: navigator.id,
            full_name: data.full_name,
            email: data.email,
            city: data.city,
            phone_number: data.phoneNumber,
            bio: data.bio,
            // Conversion de la chaîne de langues en tableau
            languages: data.languages ? data.languages.split(',').map(lang => lang.trim()).filter(lang => lang) : [],
            verified: data.verified,
        };

        console.log("Soumission de la mise à jour pour le navigateur ID:", navigator.id, payload);
        try {
            let result = await dispatch(editNavigator(payload));
            if (result.meta.requestStatus == "fulfilled") {
                reset();
                onClose();
                toast.success('Navigator Updated SuccessFully');
                return
            }

            toast.error(error);

        } catch (error) {
            console.log('Error while submitting the form edit navigator : ', error);
            reset();
        }
        onClose();
    };

    const handleClose = () => {
        onClose();
    };

    const getAvatarUrl = (userId) => {
        return `https://i.pravatar.cc/150?img=${userId}`;
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content edit-modal-content">
                <div className="modal-header">
                    <h2 className="modal-title">Edit Navigator Profile</h2>
                    <button className="modal-close-btn" onClick={handleClose} disabled={isSubmitting}>
                        <X size={20} />
                    </button>
                </div>

                <div className="details-card-container edit-form-scrollable">
                    <form onSubmit={handleSubmit(onSubmit)} className="edit-form-layout">

                        <div className="form-column core-details">
                            <h3 className="column-title">Core Details</h3>

                            <div className="avatar-preview-section">
                                <img
                                    src={getAvatarUrl(navigator.user.id)}
                                    alt={navigator.user.name}
                                    className="profile-avatar-preview"
                                />
                                <button type="button" className="change-photo-btn">Change Photo</button>
                            </div>

                            <div className="form-group">
                                <label htmlFor="fullName">Full Name</label>
                                <div className="input-with-icon">
                                    <User size={18} className="input-icon" />
                                    <input
                                        type="text"
                                        id="fullName"
                                        placeholder="Enter full name"
                                        {...register("full_name")}
                                        className={errors.fullName ? 'input-error' : ''}
                                    />
                                </div>
                                {errors.full_name && <p className="error-message">{errors.full_name.message}</p>}
                            </div>

                            {/* Email */}
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <div className="input-with-icon">
                                    <Mail size={18} className="input-icon" />
                                    <input
                                        type="email"
                                        id="email"
                                        placeholder="Enter email address"
                                        {...register("email")}
                                        className={errors.email ? 'input-error' : ''}
                                    />
                                </div>
                                {errors.email && <p className="error-message">{errors.email.message}</p>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="city">City</label>
                                <div className="input-with-icon">
                                    <Home size={18} className="input-icon" />
                                    <input
                                        type="text"
                                        id="city"
                                        placeholder="Enter city"
                                        {...register("city")}
                                        className={errors.city ? 'input-error' : ''}
                                    />
                                </div>
                                {errors.city && <p className="error-message">{errors.city.message}</p>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="phoneNumber">Phone Number</label>
                                <div className="input-with-icon">
                                    <Phone size={18} className="input-icon" />
                                    <input
                                        type="text"
                                        id="phoneNumber"
                                        placeholder="e.g., +212 600 00 00 00 (Optional)"
                                        {...register("phoneNumber")}
                                        className={errors.phoneNumber ? 'input-error' : ''}
                                    />
                                </div>
                                {errors.phoneNumber && <p className="error-message">{errors.phoneNumber.message}</p>}
                            </div>

                        </div>

                        <div className="form-column profile-details">
                            <h3 className="column-title">Profile Details</h3>

                            <div className="form-group">
                                <label htmlFor="languages">Languages (Comma Separated)</label>
                                <div className="input-with-icon">
                                    <MapPin size={18} className="input-icon" />
                                    <input
                                        type="text"
                                        id="languages"
                                        placeholder="e.g., English, French, Arabic"
                                        {...register("languages")}
                                        className={errors.languages ? 'input-error' : ''}
                                    />
                                </div>
                                <p className="hint-message">Separate languages with a comma (e.g., English, French)</p>
                                {errors.languages && <p className="error-message">{errors.languages.message}</p>}
                            </div>

                            <div className="form-group bio-group">
                                <label htmlFor="bio">Bio</label>
                                <textarea
                                    id="bio"
                                    placeholder="A short description about the navigator (Max 1000 characters)"
                                    rows="5"
                                    {...register("bio")}
                                    className={errors.bio ? 'input-error' : ''}
                                />
                                {errors.bio && <p className="error-message">{errors.bio.message}</p>}
                            </div>

                            <div className="form-group verification-group">
                                <Briefcase size={20} className="status-icon" />
                                <div className="toggle-container">
                                    <label htmlFor="verified">Verified Status</label>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            id="verified"
                                            {...register("verified")}
                                            defaultChecked={navigator.verified}
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                </div>
                            </div>

                        </div>
                    </form>
                </div>

                <div className="modal-actions full-width-actions">
                    <button type="button" className="cancel-btn" onClick={handleClose} disabled={isSubmitting}>
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="add-btn"
                        onClick={handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                    >
                        {isSubmitting && isLoading ? (
                            <>
                                <Loader2 size={18} className="spinner" />
                                Saving...
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditNavigatorModal;