import React, { useEffect } from 'react';
import { X, User, Mail, Home, Phone, Star, CheckCircle, Clock, MapPin } from 'lucide-react';
import './NavigatorDetailsModal.css';

const getAvatarUrl = (userId) => {
    return `https://i.pravatar.cc/150?img=${userId}`;
};

const NavigatorDetailsModal = ({ isOpen, onClose, navigator }) => {
    if (!isOpen || !navigator) return null;

    const { user, city, bio, languages, verified, created_at, phone_number, average_rating } = navigator;
    const { name, email, id } = user;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    useEffect(() => {
        console.log('Details popup :', navigator);
    }, [])

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2 className="modal-title">Navigator Details</h2>
                    <button className="modal-close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="details-card-container">

                    <div className="details-navigator-modal-profile-header">
                        <img
                            src={getAvatarUrl(id)}
                            alt={name}
                            className="profile-avatar"
                        />
                        <h3 className="profile-name">{name}</h3>
                        <p className="profile-email">
                            <Mail size={16} />
                            {email}
                        </p>
                        <div className="profile-meta">
                            <span className={`meta-tag ${verified ? 'verified' : 'unverified'}`}>
                                {verified ? <CheckCircle size={14} /> : <MapPin size={14} />}
                                {verified ? 'Verified Navigator' : 'Unverified'}
                            </span>
                            <span className="meta-tag rating">
                                <Star size={14} fill="#FFC72C" color="#FFC72C" />
                                {average_rating }
                            </span>
                        </div>
                    </div>

                    {/* --- Profile Body (Details) --- */}
                    <div className="profile-details-body">

                        {/* City and Phone */}
                        <div className="detail-group">
                            <div className="detail-item">
                                <Home size={18} className="detail-icon" />
                                <div className="detail-text">
                                    <span className="detail-label">City</span>
                                    <span className="detail-value">{city}</span>
                                </div>
                            </div>
                            <div className="detail-item">
                                <Phone size={18} className="detail-icon" />
                                <div className="detail-text">
                                    <span className="detail-label">Phone Number</span>
                                    <span className="detail-value">{phone_number || 'not set'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="detail-group full-width">
                            <div className="detail-item full-width">
                                <User size={18} className="detail-icon" />
                                <div className="detail-text">
                                    <span className="detail-label">Languages Spoken</span>
                                    <span className="detail-value">
                                        {languages && languages.length > 0
                                            ? languages.join(', ')
                                            : 'No languages specified.'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="detail-group full-width">
                            <div className="detail-item full-width bio-item">
                                <div className="detail-text">
                                    <span className="detail-label">Bio / Description</span>
                                    <span className="detail-value bio-content">{bio || 'No biography provided.'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="detail-group full-width">
                            <div className="detail-item">
                                <Clock size={18} className="detail-icon" />
                                <div className="detail-text">
                                    <span className="detail-label">Registration Date</span>
                                    <span className="detail-value">{formatDate(created_at)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button className="primary-btn" onClick={onClose}>Close</button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default NavigatorDetailsModal;