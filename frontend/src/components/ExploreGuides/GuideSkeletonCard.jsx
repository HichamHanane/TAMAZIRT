



const GuideSkeletonCard = () => (
    <div className="guide-card skeleton-card">
        <div className="guide-image-container skeleton-image">
            {/* Image placeholder */}
        </div>
        <div className="guide-info">
            <div className='guide_card_header'>
                {/* Guide name placeholder */}
                <div className="skeleton-line short-line"></div>
                {/* Rating placeholder */}
                <div className="skeleton-line tiny-line"></div>
            </div>
            {/* Description placeholder */}
            <div className="skeleton-line full-line"></div>
            <div className="skeleton-line medium-line"></div>

            <div className="guide-tags skeleton-tags">
                {/* Tag placeholders */}
                <div className="skeleton-tag"></div>
                <div className="skeleton-tag"></div>
            </div>
            <div className="guide-actions">
                {/* Button placeholders */}
                <div className="skeleton-button"></div>
                <div className="skeleton-button"></div>
            </div>
        </div>
    </div>
);

export default GuideSkeletonCard;