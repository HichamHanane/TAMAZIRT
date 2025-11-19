import './GuideDetailsModal.css'
import { Star, StarIcon, MapPin, Mail, Phone, X } from 'lucide-react';
const base_url = import.meta.env.VITE_BACKEND_BASE_URL
const GuideDetailsModal = ({ guide, onClose }) => {
    if (!guide) return null;

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>

                <button className="modal-close-btn" onClick={onClose}>
                    <X size={24} />
                </button>

                <div className="modal-body-wrapper">

                    <div className="modal-image-container">
                        <img
                            src={guide.profile_picture_url ? `${base_url}${guide.profile_picture_url}` : default_image}
                            alt={`Guide ${guide.user.name}`}
                            className="modal-guide-image"
                        />
                    </div>

                    <div className="modal-details-container">
                        <h2 className="guide-modal-name">{guide.user.name}</h2>

                        <div className="modal-location-rating">
                            <span className="location-text">
                                <MapPin size={18} className="lucide-icon" /> {guide.city}, Morocco
                            </span>
                            <span className='modal-rating-text'>
                                <StarIcon size={18} fill="currentColor" className="lucide-icon rating-star-icon" /> {guide.average_rating} / 5
                            </span>
                        </div>

                        <h3 className="modal-subheader">About Me</h3>
                        <p className="modal-bio">{guide.bio}</p>

                        <h3 className="modal-subheader">Spoken Languages</h3>
                        <div className="guide-tags modal-tags">
                            {guide.languages && guide.languages.map(tag => (
                                <span key={tag} className="tag-item modal-tag-item">{tag}</span>
                            ))}
                        </div>

                        <div className="modal-contact-info">
                            <p><Mail size={18} className="lucide-icon" /> {guide.user.email}</p>
                            <p><Phone size={18} className="lucide-icon" /> {guide.phone_number}</p>
                        </div>

                        
                    </div>

                </div>
            </div>
        </div>
    );
};

export default GuideDetailsModal;