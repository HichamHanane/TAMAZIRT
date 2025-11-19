import './ReviewCard.css';
import default_image from '../../../assets/vector-flat-illustration-grayscale-avatar-user-profile-person-icon-profile-picture-business-profile-woman-suitable-social-media-profiles-icons-screensavers-as-templatex9_.avif'
import { Star } from 'lucide-react';

const renderStars = (rating) => {
    const fullStar = '★';
    const emptyStar = '☆';
    return fullStar.repeat(rating) + emptyStar.repeat(5 - rating);
};

const RatingStars = ({ rating }) => {
    return (
        <div className="g-review-stars">
            {[...Array(5)].map((_, index) => (
                <Star
                    key={index}
                    size={20}
                    fill={index < rating ? "var(--g-rev-accent-gold)" : "none"}
                    stroke={index < rating ? "var(--g-rev-accent-gold)" : "var(--g-rev-border-light)"}
                    className="g-star-icon"
                />
            ))}
        </div>
    );
};

const ReviewCard = ({ review, onEdit, onDelete }) => {
    const {
        id,
        rating,
        comment,
        created_at,
        navigator,
        tourist
    } = review;

    const reviewDate = new Date(created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    return (
        <div className="review-card">
            <div className="review-header">
                <div className="user-info">
                    <img
                        src={navigator?.profile_url || default_image}
                        alt={`${navigator?.name}'s avatar`}
                        className="user-avatar"
                    />
                    <div>
                        <p className="user-name">{navigator?.name || 'Navigator'}</p>
                        <p className="navigator-name-context">Reviewed for: {navigator?.name || 'N/A'}</p>
                    </div>
                </div>
                <span className="review-date">{reviewDate}</span>
            </div>

            <div className="rating-stars"><RatingStars rating={rating} /></div>

            <p className="review-comment">{comment || 'No comment provided.'}</p>

            <div className="review-actions">
                <button
                    className="edit-review-btn"
                    onClick={() => onEdit(id)}
                >
                    Edit Review
                </button>
                <button
                    className="delete-review-btn"
                    onClick={() => onDelete(id)}
                >
                    Delete Review
                </button>
            </div>
        </div>
    );
};

export default ReviewCard;