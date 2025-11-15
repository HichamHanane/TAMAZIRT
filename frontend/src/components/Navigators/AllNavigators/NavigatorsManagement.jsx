// src/components/NavigatorsManagement.jsx (Mis à jour)

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Eye, Edit, Trash2, Plus, ChevronLeft, ChevronRight, Loader2, AlertTriangle } from 'lucide-react';
import './NavigatorsManagement.css';
import { deleteNavigator, fetchNavigators } from '../../../feature/NavigatorSlice';
import AddNavigatorModal from '../AddNavigatorModal/AddNavigatorModal';
import NavigatorDetailsModal from '../NavigatorDetailsModal/NavigatorDetailsModal';
import EditNavigatorModal from '../EditNavigatorModal/EditNavigatorModal';
import DeleteConfirmationModal from '../DeleteConfirmationModal/DeleteConfirmationModal';
import { toast } from 'sonner';

const avatarPlaceholder = "https://i.pravatar.cc/150";


const NavigatorsManagement = () => {
    const dispatch = useDispatch();
    const { isLoading, error, list } = useSelector((state) => state.navigators);
    const { status } = useSelector((state) => state.navigators.add_navigator);
    const { delete_navigator } = useSelector((state) => state.navigators);

    const [isModalOpen, setIsModalOpen] = useState(false);


    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedNavigator, setSelectedNavigator] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchNavigators());
    }, [status]);


    const openDetailsModal = (navigatorProfile) => {
        setSelectedNavigator(navigatorProfile);
        setIsDetailsModalOpen(true);
    };

    const closeDetailsModal = () => {
        setIsDetailsModalOpen(false);
        setSelectedNavigator(null);
    };

    const openEditModal = (navigatorProfile) => {
        setSelectedNavigator(navigatorProfile);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedNavigator(null);
    };


    const openDeleteModal = (navigatorProfile) => {
        setSelectedNavigator(navigatorProfile);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    const handleConfirmDelete = async () => {
        try {
            if (!selectedNavigator) return;
            console.log("Deleting navigator with ID:", selectedNavigator.id);

            let result = await dispatch(deleteNavigator(selectedNavigator.id));
            if (result.meta.requestStatus == "fulfilled") {
                setIsDeleteModalOpen(false);
                toast.success('The Navigator Deleted SuccessFully');
                return
            }
        } catch (error) {
            console.log('Error while deleting the navigatore :', error);
            setIsDeleteModalOpen(false);

        }

    };
    let content;

    if (isLoading) {
        content = (
            <div className="status-message loading">
                <Loader2 size={24} className="spinner" />
                <span>Loading Navigators...</span>
            </div>
        );
    } else if (error) {
        content = (
            <div className="status-message error">
                <AlertTriangle size={24} />
                <span>Error fetching data: {error}</span>
            </div>
        );
    } else if (list?.length === 0) {
        content = (
            <div className="status-message empty">
                <span>No navigators found. Click "Add New Navigator" to start.</span>
            </div>
        );
    } else if (list?.length > 0) {
        content = (
            <div className="navigators-table-card">
                <div className="responsive-table-wrapper">
                    <table className="navigators-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th className="hide-on-mobile">Email</th>
                                <th className="hide-on-mobile">City</th>
                                <th className="actions-column">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list?.map((profile) => (
                                <tr key={profile?.id}>
                                    <td data-label="Name">
                                        <div className="navigator-profile-cell">
                                            <img
                                                src={`${import.meta.env.VITE_BACKEND_BASE_URL}${profile?.profile_picture_url }`|| `${avatarPlaceholder}?img=${profile?.user?.id}`}
                                                alt={profile?.user?.name}
                                                className="navigator-avatar"
                                            />
                                            <span className="navigator-name">{profile?.user?.name}</span>
                                        </div>
                                    </td>
                                    <td data-label="Email" className="hide-on-mobile">{profile?.user?.email}</td>
                                    <td data-label="City" className="hide-on-mobile">{profile?.city}</td>
                                    <td data-label="Actions" className="actions-cell">
                                        <div className="action-icons">
                                            <button
                                                title="View"
                                                className="action-btn view-btn"
                                                onClick={() => openDetailsModal(profile)}
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                title="Edit"
                                                className="action-btn edit-btn"
                                                onClick={() => openEditModal(profile)}
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                title="Delete"
                                                className="action-btn delete-btn"
                                                onClick={() => openDeleteModal(profile)}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* <div className="navigators-pagination">
                    <button className="pagination-btn" disabled><ChevronLeft size={18} /></button>
                    <span className="page-number active">1</span>
                    <span className="page-number">2</span>
                    <button className="pagination-btn"><ChevronRight size={18} /></button>
                </div> */}
            </div>
        );
    }

    return (
        <div className="navigators-management-page">

            <div className="navigators-header-area">
                <div className="navigators-title-group">
                    <h1 className="page-title">Navigators</h1>
                    <p className="page-subtitle">Manage all registered navigators on the platform.</p>
                </div>

                <button
                    className="add-navigator-btn"
                    onClick={() => setIsModalOpen(true)}
                >
                    <Plus size={18} />
                    <span>Add New Navigator</span>
                </button>
            </div>

            {/* <div className="navigators-search-bar-container">
                <Search size={20} className="search-icon-navigators" />
                <input
                    type="text"
                    placeholder="Search by name, email, or city..."
                    className="navigators-search-input"
                />
            </div> */}

            {content}

            <AddNavigatorModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            // onAddNavigator={handleAddNavigator}
            />
            <NavigatorDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={closeDetailsModal}
                navigator={selectedNavigator}
            />

            <EditNavigatorModal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                navigator={selectedNavigator}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={handleConfirmDelete}
                navigatorName={selectedNavigator?.user.name}
                isDeleting={delete_navigator.isLoqding}
            />
        </div>
    );
};

export default NavigatorsManagement;