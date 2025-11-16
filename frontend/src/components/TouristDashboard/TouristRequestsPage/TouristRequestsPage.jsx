import React, { useEffect, useState } from 'react';
import { MapPin, Calendar, Users, Send, Edit, Trash2, Clock, CheckCircle, XCircle, Loader2, X } from 'lucide-react'; // <-- Ajout de X
import { useSelector, useDispatch } from 'react-redux';
import { fetchTouristRequests, deleteTouristRequest, updateTouristRequest } from '../../../feature/RequestSlice';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import './TouristRequestsPage.css';
import { toast } from 'sonner';


const editRequestSchema = yup.object().shape({
    destination: yup.string().required("Destination is required").min(3, "Destination must be at least 3 characters"),
    number_of_people: yup.number().typeError("Number of persons must be a number").required("Number of persons is required").min(1, "Must be at least 1 person"),
    date: yup.string().required("Date is required"), 
    message: yup.string().max(500, "Message cannot exceed 500 characters"),
})

const DeleteConfirmationModal = ({ requestId, requestName, onClose, onConfirm, isDeleting }) => {
    return (
        <div className="t-modal-backdrop">
            <div className="t-delete-modal-content">
                <button className="t-modal-close-btn" onClick={onClose}><X size={20} /></button>

                <h3 className="t-modal-title">Confirm Deletion</h3>
                <p className="t-modal-message">
                    Are you sure you want to delete the request made to **{requestName}**?
                    This action is final and cannot be undone.
                </p>

                <div className="t-modal-actions">
                    <button onClick={onClose} className="t-action-btn t-modal-cancel-btn">
                        Cancel
                    </button>
                    <button onClick={() => onConfirm(requestId)} className="t-action-btn t-modal-delete-btn">
                        <Trash2 size={16} />
                        {
                            isDeleting ? 'Deleting' : 'Delete Request'
                        }
                    </button>
                </div>
            </div>
        </div>
    );
};

const EditRequestModal = ({ request, onClose }) => {
    const dispatch = useDispatch();
    const { isUpdating } = useSelector(state => state.requests.tourist); 

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(editRequestSchema),
        defaultValues: {
            destination: request.destination,
            number_of_people: request.number_of_people,
            date: request.date,
            message: request.message,
        }
    });

    const onSubmit = async (data) => {
        try {
            let result = await dispatch(updateTouristRequest({ id: request.id, requestData: data }))

            if (result.meta.requestStatus === "fulfilled") {
                onClose();
                toast.success('Request Updated Successfully')

            }
        } catch (error) {
            console.log('Error while dispatchi update request action :', error);

        }
    };

    const formatDateForDisplay = (dateString) => {
        if (!dateString) return '';
        const [year, month, day] = dateString.split('-');
        return `${new Date(year, month - 1, day).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}`;
    };

    return (
        <div className="t-modal-backdrop">
            <div className="t-edit-modal-content">
                <button className="t-modal-close-btn" onClick={onClose}><X size={20} /></button>

                <h3 className="t-modal-title">Edit Trip Request</h3>
                <p className="t-modal-subtitle-unique">
                    Modify the details for your trip to {request.destination}.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="t-edit-form">
                    <div className="t-form-group">
                        <label htmlFor="destination" className="t-form-label">Destination</label>
                        <input
                            type="text"
                            id="destination"
                            {...register('destination')}
                            className="t-form-input"
                        />
                        {errors.destination && <p className="t-form-error">{errors.destination.message}</p>}
                    </div>

                    <div className="t-form-grid">
                        <div className="t-form-group">
                            <label htmlFor="number_of_people" className="t-form-label">Number of Persons</label>
                            <input
                                type="number"
                                id="number_of_people"
                                {...register('number_of_people')}
                                className="t-form-input"
                            />
                            {errors.number_of_people && <p className="t-form-error">{errors.number_of_people.message}</p>}
                        </div>

                        <div className="t-form-group">
                            <label htmlFor="date" className="t-form-label">Date</label>
                            <input
                                type="date"
                                id="date"
                                {...register('date')}
                                className="t-form-input"
                            />
                            {errors.date && <p className="t-form-error">{errors.date.message}</p>}
                        </div>
                    </div>

                    <div className="t-form-group">
                        <label htmlFor="message" className="t-form-label">Message</label>
                        <textarea
                            id="message"
                            rows="5"
                            {...register('message')}
                            className="t-form-textarea"
                        ></textarea>
                        {errors.message && <p className="t-form-error">{errors.message.message}</p>}
                    </div>

                    <div className="t-modal-actions">
                        <button
                            type="button"
                            onClick={onClose}
                            className="t-action-btn t-modal-cancel-btn"
                            disabled={isUpdating}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="t-action-btn t-modal-save-btn"
                            disabled={isUpdating}
                        >
                            {isUpdating ? <Loader2 size={18} className="t-loader-spin" /> : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const TouristRequestsPage = () => {
    const dispatch = useDispatch();
    const { requests, isLoading, error, isDeleting } = useSelector(state => state.requests.tourist);

    const [modalOpen, setModalOpen] = useState(false);
    const [requestToDelete, setRequestToDelete] = useState(null);

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [requestToEdit, setRequestToEdit] = useState(null);

    useEffect(() => {
        dispatch(fetchTouristRequests());
    }, [dispatch]);

    const handleOpenDeleteModal = (request) => {
        setRequestToDelete(request);
        setModalOpen(true);
    };

    const handleConfirmDelete = async (id) => {
        try {
            let result = await dispatch(deleteTouristRequest(id));

            if (result.meta.requestStatus === "fulfilled") {
                setModalOpen(false);
                setRequestToDelete(null);
                toast.success('Request deleted successfully!')
            }
        } catch (error) {
            console.log('Error while dispatching delete tourist request : ', error);
        }


    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setRequestToDelete(null);
    };

    const handleOpenEditModal = (request) => {
        setRequestToEdit(request);
        setEditModalOpen(true);
    };
    const handleCloseEditModal = () => {
        setEditModalOpen(false);
        setRequestToEdit(null);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getStatusVisual = (status) => {
        switch (status) {
            case 'Confirmed':
                return { icon: <CheckCircle size={20} />, className: "t-req-status-confirmed" };
            case 'Pending':
                return { icon: <Clock size={20} />, className: "t-req-status-pending" };
            case 'Cancelled':
                return { icon: <XCircle size={20} />, className: "t-req-status-cancelled" };
            default:
                return { icon: <Clock size={20} />, className: "t-req-status-pending" };
        }
    };

    if (isLoading) {
        return (
            <div className="t-req-container t-req-loading-state">
                <Loader2 size={32} className="t-req-loader-spin" />
                <p>Loading your requests...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="t-req-container t-req-error-state">
                <XCircle size={32} color="var(--t-req-color-error)" />
                <h1 className="t-req-header">Error</h1>
                <p className="t-req-error-message">Failed to load requests: {error}</p>
                <p>Please check your network connection or try again later.</p>
            </div>
        );
    }

    return (
        <div className="t-req-container">
            {/* ... (Header and Subtitle) ... */}
            <h1 className="t-req-header">My Guide Requests</h1>
            <p className="t-req-subtitle">Track the status of your guide requests, update plans, or cancel a trip.</p>

            <div className="t-req-list">
                {requests && requests?.length === 0 ? (
                    <p className="t-req-no-message">You have not sent any requests yet.</p>
                ) : (
                    requests?.map(request => {
                        const { icon, className: statusClass } = getStatusVisual(request?.status);

                        return (
                            <div key={request?.id} className="t-req-card">
                                {/* ... (Header, Separator, Body) ... */}
                                <div className="t-req-card-header-new">
                                    <div className="t-req-navigator-info">
                                        <p className="t-req-guide-label">Guide</p>
                                        <h3 className="t-req-navigator-name-unique">{request?.navigator?.name}</h3>
                                    </div>

                                    <div className={`t-req-status-badge ${statusClass}`}>
                                        {icon}
                                        <span className="t-req-status-text">{request?.status}</span>
                                    </div>
                                </div>

                                <div className="t-req-card-separator"></div>

                                <div className="t-req-card-body">
                                    <div className="t-req-details-grid-unique">

                                        <div className="t-req-detail-box">
                                            <Calendar size={18} className="t-req-detail-icon" />
                                            <span className="t-req-detail-label">DATE</span>
                                            <span className="t-req-detail-value">{formatDate(request?.date)}</span>
                                        </div>

                                        <div className="t-req-detail-box">
                                            <MapPin size={18} className="t-req-detail-icon" />
                                            <span className="t-req-detail-label">DESTINATION</span>
                                            <span className="t-req-detail-value">{request?.destination}</span>
                                        </div>

                                        <div className="t-req-detail-box">
                                            <Users size={18} className="t-req-detail-icon" />
                                            <span className="t-req-detail-label">GROUP SIZE</span>
                                            <span className="t-req-detail-value">{request?.number_of_people}</span>
                                        </div>

                                        <div className="t-req-detail-box">
                                            <Send size={18} className="t-req-detail-icon" />
                                            <span className="t-req-detail-label">SENT ON</span>
                                            <span className="t-req-detail-value">{formatDate(request?.created_at)}</span>
                                        </div>
                                    </div>

                                    <div className="t-req-message-container">
                                        <p className="t-req-message-label-unique">Your Message</p>
                                        <p className="t-req-message-text-unique">{request?.message}</p>
                                    </div>
                                </div>

                                {/* 3. ACTIONS */}
                                <div className="t-req-card-actions-unique">
                                    {request?.status === 'Pending' && (
                                        <button
                                            onClick={() => handleOpenEditModal(request)}
                                            className="t-req-action-btn t-req-edit-btn"
                                            title="Edit Request"
                                        >
                                            <Edit size={16} /> Edit
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleOpenDeleteModal(request)}
                                        className="t-req-action-btn t-req-delete-btn"
                                        title="Delete Request"
                                    >
                                        <Trash2 size={16} /> Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {modalOpen && requestToDelete && (
                <DeleteConfirmationModal
                    requestId={requestToDelete.id}
                    requestName={requestToDelete.navigator.name}
                    onClose={handleCloseModal}
                    onConfirm={handleConfirmDelete}
                    isDeleting={isDeleting}
                />
            )}


            {editModalOpen && requestToEdit && (
                <EditRequestModal
                    request={requestToEdit}
                    onClose={handleCloseEditModal}
                />
            )}
        </div>
    );
};

export default TouristRequestsPage;