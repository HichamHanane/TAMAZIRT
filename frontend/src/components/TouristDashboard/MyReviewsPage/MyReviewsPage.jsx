import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteReview, getTouristReviews, updateReview } from '../../../feature/ReviewSlice';
import ReviewCard from './ReviewCard';
import ConfirmationDeleteModal from './ConfirmationDeleteModal/ConfirmationDeleteModal';
import { toast } from 'sonner';
import EditReviewModal from './EditReviewModal/EditReviewModal';




const MyReviewsPage = () => {
    const dispatch = useDispatch();
    const { reviews, isLoading, error } = useSelector((state) => state.reviews.tourist);
    const { delete_review } = useSelector((state) => state.reviews);
    const { update_review } = useSelector((state) => state.reviews);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reviewToDeleteId, setReviewToDeleteId] = useState(null);


    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [reviewToEdit, setReviewToEdit] = useState(null);

    useEffect(() => {
        dispatch(getTouristReviews());
    }, [dispatch]);

    const handleEdit = (reviewId) => {
        const review = reviews.find(r => r.id === reviewId);
        if (review) {
            setReviewToEdit(review);
            setIsEditModalOpen(true);
        }
    };

    const handleUpdateSubmit = async (data) => {
        console.log('the handle edit review ');

        try {
            let result = await dispatch(updateReview(data));

            if (result.meta.requestStatus === "fulfilled") {
                toast.success('Review Updated Successfully');
                handleCloseEditModal();

            }
            else {
                toast.error(`Failed to update review: ${err}`)
            }
            handleCloseEditModal();

        } catch (error) {
            console.log("error while dispatching edit review :", error);

        }
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setReviewToEdit(null);
    };

    const handleDelete = (reviewId) => {
        setReviewToDeleteId(reviewId);
        setIsModalOpen(true);
    };

    const handleConfirmDelete = async () => {

        if (reviewToDeleteId !== null) {
            let result = await dispatch(deleteReview(reviewToDeleteId));

            if (result.meta.requestStatus === "fulfilled") {
                toast.success('Review Deleted Successfully');
            }
            else {
                toast.error(`Failed to delete review: ${err}`)
            }
            setReviewToDeleteId(null);

        }

        setIsModalOpen(false);

    };

    const handleCancelDelete = () => {
        setIsModalOpen(false);
        setReviewToDeleteId(null);
    };

    if (isLoading) {
        return <div className="loading-message">Loading your reviews...</div>;
    }

    if (error) {
        return <div className="error-message">Error: {error}</div>;
    }

    return (
        <div className="my-reviews-page-container">
            <h1 className="requests-section-title">Your Submitted Reviews ({reviews.length})</h1>

            {reviews.length === 0 ? (
                <p className="no-reviews-message">You haven't submitted any reviews yet.</p>
            ) : (
                <div className="reviews-grid">
                    {reviews.map((review) => (
                        <ReviewCard
                            key={review.id}
                            review={review}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            <ConfirmationDeleteModal
                isOpen={isModalOpen}
                title="Confirm Deletion"
                message={`Are you sure you want to delete this review? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                confirmText="Yes, Delete It"
                isLoading={delete_review.isLoading}
            />

            <EditReviewModal
                isOpen={isEditModalOpen}
                reviewData={reviewToEdit}
                onClose={handleCloseEditModal}
                onSubmit={handleUpdateSubmit}
                isLoading={update_review.isLoading}
            />
        </div>
    );
};

export default MyReviewsPage;