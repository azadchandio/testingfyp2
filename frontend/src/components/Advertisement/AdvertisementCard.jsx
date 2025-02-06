import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Advertisement.css';
import SaveButton from './SaveButton';

const AdvertisementCard = ({ advertisement }) => {
    return (
        <div className="product-card">
            <Link to={`/product/${advertisement.id}`}>
                <div className="product-image">
                    {advertisement.images && advertisement.images.length > 0 ? (
                        <img 
                            src={`http://127.0.0.1:8000${advertisement.images[0].image_url}`} 
                            alt={advertisement.title} 
                        />
                    ) : (
                        <div className="no-image">No Image</div>
                    )}
                    <SaveButton 
                        advertisementId={advertisement.id}
                        initialSaved={advertisement.is_saved}
                    />
                    {advertisement.featured && <span className="featured-tag">Featured</span>}
                </div>
                <div className="product-info">
                    <h3 className="product-title">{advertisement.title}</h3>
                    <div className="product-meta">
                        <span className="product-price">Rs {advertisement.price}</span>
                        <div className="product-details">
                            <span className="product-location">{advertisement.location.city}</span>
                            <span className="separator">•</span>
                            <span className="product-time">
                                {new Date(advertisement.created_at).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

AdvertisementCard.propTypes = {
    advertisement: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        images: PropTypes.array,
        featured: PropTypes.bool,
        location: PropTypes.shape({
            city: PropTypes.string,
            state: PropTypes.string
        }),
        created_at: PropTypes.string,
        is_saved: PropTypes.bool,
        views_count: PropTypes.number,
        condition: PropTypes.string,
        negotiable: PropTypes.bool
    }).isRequired
};

export default AdvertisementCard;