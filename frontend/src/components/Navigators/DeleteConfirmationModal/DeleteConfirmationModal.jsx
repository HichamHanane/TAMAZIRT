import React from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import './DeleteConfirmationModal.css';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, navigatorName, isDeleting }) => {
    if (!isOpen) return null;
    const targetName = navigatorName || 'this navigator';

    return (
        <div className="modal-overlay">
            <div className="modal-content delete-confirmation-modal">
                <div className="modal-header delete-header">
                    <h2 className="modal-title">Confirm Deletion</h2>
                    <button className="modal-close-btn" onClick={onClose} disabled={isDeleting}>
                        <X size={20} />
                    </button>
                </div>

                <div className="delete-body">
                    <AlertTriangle size={48} className="warning-icon" />
                    <p className="delete-message">
                        Are you sure you want to permanently delete **{targetName}**?
                    </p>
                    <p className="delete-subtitle">
                        This action cannot be undone and all associated data will be lost.
                    </p>
                </div>

                <div className="modal-actions delete-actions">
                    <button
                        className="cancel-btn"
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        Cancel
                    </button>
                    <button
                        className="delete-confirm-btn"
                        onClick={onConfirm}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 size={18} className="spinner" />
                                Deleting...
                            </>
                        ) : (
                            'Yes, Delete'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;