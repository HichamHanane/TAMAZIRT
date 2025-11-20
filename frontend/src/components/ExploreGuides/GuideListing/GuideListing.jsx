import React, { useEffect, useState } from 'react';
import './GuideListing.css'
import default_image from '../../../assets/vector-flat-illustration-grayscale-avatar-user-profile-person-icon-profile-picture-business-profile-woman-suitable-social-media-profiles-icons-screensavers-as-templatex9_.avif'
import { useDispatch, useSelector } from 'react-redux';
import { fetchNavigators } from '../../../feature/GuideSlice';
import { Star, StarIcon } from 'lucide-react';
import GuideDetailsModal from '../GuideDetailsModal/GuideDetailsModal';
import SendRequestModal from '../SendRequestModal/SendRequestModal';
import GuideSkeletonCard from '../GuideSkeletonCard';
import { useParams } from 'react-router-dom';

const base_url = import.meta.env.VITE_BACKEND_BASE_URL


const GuideCard = ({ guide, onDetailsClick, onSendRequestClick }) => (
    <div className="guide-card">
        <div className="guide-image-container">
            {/* Display the guide's avatar or a default image */}
            <img
                src={guide.profile_picture_url ? `${base_url}${guide.profile_picture_url}` : default_image}
                alt={`Guide ${guide.profile_picture_url}`}
                className="guide-image"
            />
        </div>
        <div className="guide-info">
            {/* Guide data from the backend: user.name, rating, etc. */}
            <div className='guide_card_header'>
                <h3 className="guide-name">{guide.user.name}</h3>
                <span className='guide_avg_rating'>{guide.average_rating} <StarIcon size={15} /></span>
            </div>
            {/* <h3 className="guide-name">{guide.user.name}</h3> */}

            <p className="guide-description">{guide.bio}</p>
            <div className="guide-tags">
                {/* Languages are in an array on the backend */}
                {guide.languages && guide.languages.map(tag => (
                    <span key={tag} className="tag-item">{tag}</span>
                ))}
            </div>
            <div className="guide-actions">
                <button
                    className="btn-request"
                    onClick={() => onSendRequestClick(guide)}
                >
                    Send Request
                </button>
                <button
                    className="btn-details"
                    onClick={() => onDetailsClick(guide)}
                >
                    More Details
                </button>
            </div>
        </div>
    </div>
);

const GuideListing = () => {
    const { name } = useParams()

    const dispatch = useDispatch();
    const { items, status, error, currentPage, lastPage } = useSelector(
        (state) => state.guides
    );
    let [city, setCity] = useState(name)


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGuide, setSelectedGuide] = useState(null)

    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

    const openModal = (guide) => {
        setSelectedGuide(guide);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedGuide(null);
    }


    const openRequestModal = (guide) => {
        setSelectedGuide(guide);
        setIsRequestModalOpen(true);
    };

    const closeRequestModal = () => {
        setIsRequestModalOpen(false);
        setSelectedGuide(null);
    }





    const handlePageChange = (page) => {
        if (page > 0 && page <= lastPage && page !== currentPage) {
            dispatch(fetchNavigators({ page }));
            window.scrollTo(0, 0);
        }
    };

    const handleSearch = () => {
        try {
            dispatch(fetchNavigators({ page: 1, city }));
        } catch (error) {
            console.log('Error while dispatching fetch all the naviagtors : ', error);

        }
    }


    useEffect(() => {
        console.log('City in the guides page : ', name);
        dispatch(fetchNavigators({ page: 1, city }));
    }, [dispatch]);

    let content;
    const SKELETON_COUNT = 9;
    if (status === 'loading') {

        content = (
            <div className="guides-grid">
                {Array(SKELETON_COUNT).fill(0).map((_, index) => (
                    <GuideSkeletonCard key={index} />
                ))}
            </div>
        );

    }
    else if (status === 'failed') {

        content = <div className="error-message">Error: {error}</div>;

    }
    else if (status === 'succeeded' && items?.length > 0) {

        content = (
            <div className="guides-grid">
                {items?.map((guide) => (
                    <GuideCard
                        key={guide?.id}
                        guide={guide}
                        onDetailsClick={openModal}
                        onSendRequestClick={openRequestModal}
                    />
                ))}
            </div>

        );
    }
    else if (status === 'succeeded' && items?.length === 0) {

        content = <div className="no-guides-message">No guides found matching your criteria.</div>;

    }

    return (
        <div className="guide-listing-page">
            <section className="hero-banner">
                <h1 className="hero-title">Your Moroccan Adventure Awaits</h1>
                <p className="hero-subtitle">Connect with local experts for an authentic and unforgettable journey.</p>
                <div className="search-bar-container">
                    <input
                        type="text"
                        placeholder="Search by city..."
                        className="search-input"
                        onChange={(e) => setCity(e.target.value)}
                        value={city}

                    />
                    <button className="search-button" onClick={handleSearch}>Search</button>
                </div>
            </section>

            <section className="featured-guides-section">
                <h2 className="section-title">Meet Our Local Experts</h2>

                {content}

                {status === 'succeeded' && lastPage > 1 && (
                    <div className="pagination-controls">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="btn-pagination"
                        >
                            Previous
                        </button>

                        <span className="page-info">
                            Page {currentPage} of {lastPage}
                        </span>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === lastPage}
                            className="btn-pagination"
                        >
                            Next
                        </button>
                    </div>
                )}

            </section>
            {isModalOpen && <GuideDetailsModal guide={selectedGuide} onClose={closeModal} />}

            {isRequestModalOpen && (
                <SendRequestModal
                    guide={selectedGuide}
                    onClose={closeRequestModal}
                />
            )}
        </div>
    );
};

export default GuideListing;