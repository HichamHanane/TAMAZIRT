// src/components/TouristManagement.jsx

import React, { useState, useEffect } from 'react';
import { Search, UserCircle, Mail, Phone, Clock, MapPin, UserCheck, Eye, Trash2, Loader2, Plus } from 'lucide-react';
import './TouristManagement.css';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTourist, fetchAllTourists } from '../../../feature/touristsSlice';
import AddTouristModal from '../AddTouristModal/AddTouristModal';
import DeleteConfirmationModal from '../../Navigators/DeleteConfirmationModal/DeleteConfirmationModal';
import { toast } from 'sonner';



const avatarPlaceholder = "https://i.pravatar.cc/150";


const TouristManagement = () => {
    const { delete_tourist } = useSelector(state => state.tourists);
    const touristsData = useSelector(state => state.tourists.tourists);
    const isLoading = useSelector(state => state.tourists.isLoading);
    const error = useSelector(state => state.tourists.error);
    const dispatch = useDispatch()
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTourist, setSelectedTourist] = useState(null);

    const openAddModal = () => setIsAddModalOpen(true);
    const closeAddModal = () => setIsAddModalOpen(false);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const openDeleteModal = (touristProfil) => {
        setSelectedTourist(touristProfil);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    const handleConfirmDelete = async () => {
        try {
            if (!selectedTourist) return;
            console.log("Deleting navigator with ID:", selectedTourist.id);

            let result = await dispatch(deleteTourist(selectedTourist.id));
            if (result.meta.requestStatus == "fulfilled") {
                setIsDeleteModalOpen(false);
                toast.success('The tourist Deleted SuccessFully');
                return
            }
        } catch (error) {
            console.log('Error while deleting the tourist :', error);
            setIsDeleteModalOpen(false);

        }

    };

    useEffect(() => {
        dispatch(fetchAllTourists());
        console.log('Tourists :', touristsData);

    }, []);
    return (
        <div className="tourist-management-page">

            <div className="management-header">
                <h1 className="page-title">Tourist Management</h1>
                <div className="header-actions">
                    <div className="header-actions">
                        <button className="add-navigator-btn" onClick={openAddModal}>
                            <Plus size={20} />
                            Add New Tourist
                        </button>
                    </div>
                </div>
            </div>
            <div className="tourist-table-container">
                {isLoading ? (
                    <div className="loading-state">
                        <Loader2 size={36} className="spinner" />
                        <p>Loading tourist data...</p>
                    </div>
                ) : error ? (
                    <div className="error-state">
                        <p>Error: {error}</p>
                        <p>Could not fetch tourist data. Please check the API status.</p>
                    </div>
                ) : touristsData?.length > 0 ? (
                    <table className="tourist-table">
                        <thead>
                            <tr>
                                <th>Tourist</th>
                                <th className="hide-on-mobile">Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {touristsData?.map((tourist) => (
                                <tr key={tourist.id}>
                                    <td data-label="Tourist">
                                        <div className="profile-info">
                                            <img
                                                src={`${avatarPlaceholder}?img=${tourist?.id}`}
                                                alt={tourist.name}
                                                className="table-avatar"
                                            />
                                            <span className="profile-name">{tourist.name}</span>
                                        </div>
                                    </td>
                                    <td data-label="Email" className="hide-on-mobile">
                                        {tourist.email}
                                    </td>


                                    <td data-label="Actions">
                                        <div className="action-buttons">
                                            <button
                                                title="Delete"
                                                className="action-btn delete-btn"
                                                onClick={() => openDeleteModal(tourist)}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="no-results-message">No tourists found matching your criteria.</p>
                )}
            </div>

            <AddTouristModal
                isOpen={isAddModalOpen}
                onClose={closeAddModal}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                navigatorName={selectedTourist?.name}
                onConfirm={handleConfirmDelete}
                isDeleting={delete_tourist.isLoading}
            />

        </div>
    );
};

export default TouristManagement;