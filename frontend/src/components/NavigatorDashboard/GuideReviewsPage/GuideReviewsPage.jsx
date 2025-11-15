import React, { useEffect, useState } from 'react';
import { Star, MessageSquareText, Search, Loader2 } from 'lucide-react';
import './GuideReviewsPage.css';
import { useDispatch, useSelector } from 'react-redux';
import { getNavigatorReviews } from '../../../feature/ReviewSlice';
import defaul_image from '../../../assets/vector-flat-illustration-grayscale-avatar-user-profile-person-icon-profile-picture-business-profile-woman-suitable-social-media-profiles-icons-screensavers-as-templatex9_.avif'
const formatDateTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
        const date = new Date(timestamp);
        // Date: DD/MM/YYYY
        const datePart = date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
        // Time: HH:MM
        const timePart = date.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });

        return `${datePart} at ${timePart}`;
    } catch (e) {
        return 'Invalid Date';
    }
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

const GuideReviewsPage = () => {
    const { reviews, isLoading, error } = useSelector(state => state.reviews.navigator)
    const dispatch = useDispatch()


    useEffect(() => {
        dispatch(getNavigatorReviews())
    }, [])

    return (
        <div className="g-rev-container">

            <div className="g-rev-header">
                <h1 className="g-rev-title">
                    Customer Reviews
                </h1>

            </div>

            <div className="g-rev-list">
                {isLoading ? (
                    <div className="g-loading-state">
                        <Loader2 size={30} className="g-loader-spin" />
                        <p>Loading reviews...</p>
                    </div>
                ) : reviews?.length > 0 ? (
                    reviews?.map(review => (
                        <div key={review.id} className="g-rev-card">

                            <div className="g-rev-card-header">
                                <div className="g-rev-tourist-info">
                                    <img src={review.touristAvatar || defaul_image} alt={review.touristName} className="g-rev-tourist-avatar" />
                                    <div>
                                        <h2 className="g-rev-trip-title"> Reviewed by {review?.tourist.name}</h2>
                                        <p className="g-rev-from-tourist">{formatDateTime(review.created_at)}</p>
                                    </div>
                                </div>
                                <RatingStars rating={review.rating} />
                            </div>

                            <div className="g-rev-comment-section">
                                <p className="g-rev-comment-text">{review.comment}</p>
                            </div>


                        </div>
                    ))
                ) : (
                    <p className="g-no-results-message">No reviews found matching your criteria.</p>
                )}
            </div>

        </div>
    );
};

export default GuideReviewsPage;