import React from 'react';
import './ConfirmationDeleteModal.css';
import { TriangleAlert } from 'lucide-react';

const AlertIcon = () => <div className="g-rev-modal-icon-container"><TriangleAlert size={50} /></div>;

const ConfirmationDeleteModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Delete", cancelText = "Cancel", isLoading }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className={`g-rev-modal-backdrop ${isOpen ? 'is-open' : ''}`} onClick={onCancel}>
            <div
                className="g-rev-modal-content"
                onClick={(e) => e.stopPropagation()}
            >

                <AlertIcon />

                <h3 className="g-rev-modal-title">{title}</h3>
                <p className="g-rev-modal-message">{message}</p>

                <div className="g-rev-modal-actions">
                    <button
                        className="g-rev-btn-cancel"
                        onClick={onCancel}
                    >
                        {cancelText}
                    </button>
                    <button
                        className="g-rev-btn-confirm"
                        onClick={onConfirm}
                    >
                        {
                            isLoading ? 'Deleting...' : confirmText
                        }

                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationDeleteModal;