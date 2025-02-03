import { useState } from 'react';
import PropTypes from 'prop-types';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { advertisementService } from '../../services/advertisement.service';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './SaveButton.css';

const SaveButton = ({ advertisementId, initialSaved = false }) => {
    const [isSaved, setIsSaved] = useState(initialSaved);
    const [isLoading, setIsLoading] = useState(false);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleSave = async (e) => {
        e.preventDefault(); // Prevent link click propagation
        
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        setIsLoading(true);
        try {
            await advertisementService.toggleFavorite(advertisementId);
            setIsSaved(!isSaved);
        } catch (error) {
            console.error('Error toggling favorite:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button 
            className={`save-button ${isSaved ? 'saved' : ''}`}
            onClick={handleSave}
            disabled={isLoading}
        >
            {isSaved ? <FaHeart /> : <FaRegHeart />}
        </button>
    );
};

// Add PropTypes validation
SaveButton.propTypes = {
    advertisementId: PropTypes.number.isRequired,
    initialSaved: PropTypes.bool
};

// Add default props
SaveButton.defaultProps = {
    initialSaved: false
};

export default SaveButton; 