import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import './EditReviewModal.css';
import { Star } from 'lucide-react'; 
import * as yup from 'yup';

const reviewValidationSchema = yup.object().shape({
    rating: yup
        .number()
        .typeError('Rating must be a number')
        .required('The rating is required.')
        .integer('Rating must be an integer.')
        .min(1, 'Rating must be at least 1 star.')
        .max(5, 'Rating cannot exceed 5 stars.'),

    comment: yup
        .string()
        .nullable()
        .max(500, 'The comment must not exceed 500 characters.')
        .optional(),
});

const EditReviewModal = ({ isOpen, reviewData, onClose, onSubmit, isLoading }) => {
    const {
        control,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: yupResolver(reviewValidationSchema),
        defaultValues: {
            rating: 0,
            comment: '',
        },
    });

    const currentRating = watch('rating');

    useEffect(() => {
        if (reviewData) {
            reset({
                rating: parseInt(reviewData.rating) || 0,
                comment: reviewData.comment || '',
            });
        }
    }, [reviewData, reset]);

    if (!isOpen || !reviewData) {
        return null;
    }

    const onFormSubmit = (data) => {
        console.log("edit review data : ", data);

        const dataWithId = {
            ...data,
            id: reviewData.id
        };

        onSubmit(dataWithId);
    };

    return (
        <div className={`g-rev-modal-backdrop ${isOpen ? 'is-open' : ''}`} onClick={onClose}>
            <div
                className="g-rev-edit-modal-content"
                onClick={(e) => e.stopPropagation()}
            >
                <h3>Edit Your Review for {reviewData.navigator?.name || 'Navigator'}</h3>

                <form onSubmit={handleSubmit(onFormSubmit)}>

                    <div className="g-rev-edit-form-group">
                        <label>Rating *</label>
                        <Controller
                            name="rating"
                            control={control}
                            render={({ field: { onChange } }) => (
                                <div className="g-rev-edit-rating-input">
                                    {[...Array(5)].map((_, index) => {
                                        const ratingValue = index + 1;
                                        return (
                                            <Star
                                                key={ratingValue}
                                                size={30}
                                                fill={ratingValue <= currentRating ? "var(--color-accent-gold, #FF8C00)" : "none"}
                                                stroke={ratingValue <= currentRating ? "var(--color-accent-gold, #FF8C00)" : "var(--color-border-light, #EBEBEB)"}
                                                className="g-rev-edit-star-icon"
                                                onClick={() => onChange(ratingValue)}
                                            />
                                        );
                                    })}
                                </div>
                            )}
                        />
                        {errors.rating && <p className="g-rev-edit-error">{errors.rating.message}</p>}
                    </div>

                    <div className="g-rev-edit-form-group">
                        <label htmlFor="comment">Comment</label>
                        <Controller
                            name="comment"
                            control={control}
                            render={({ field }) => (
                                <textarea
                                    {...field}
                                    id="comment"
                                    rows="4"
                                    placeholder="Share details about your experience..."
                                />
                            )}
                        />
                        {errors.comment && <p className="g-rev-edit-error">{errors.comment.message}</p>}
                    </div>

                    <div className="g-rev-edit-actions">
                        <button
                            type="button"
                            className="g-rev-edit-btn-cancel"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="g-rev-edit-btn-submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting || isLoading ? 'Updating...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditReviewModal;