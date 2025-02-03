import { useState } from 'react';
import PropTypes from 'prop-types';
import { FaShare, FaFacebook, FaTwitter, FaWhatsapp, FaCopy } from 'react-icons/fa';
import './ShareButton.css';

const ShareButton = ({ advertisementId, title }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [copied, setCopied] = useState(false);
    
    const url = `${window.location.origin}/product/${advertisementId}`;
    
    const shareOptions = [
        {
            icon: <FaFacebook />,
            label: 'Facebook',
            action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`)
        },
        {
            icon: <FaTwitter />,
            label: 'Twitter',
            action: () => window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`)
        },
        {
            icon: <FaWhatsapp />,
            label: 'WhatsApp',
            action: () => window.open(`https://wa.me/?text=${title} ${url}`)
        },
        {
            icon: <FaCopy />,
            label: copied ? 'Copied!' : 'Copy Link',
            action: () => {
                navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        }
    ];

    return (
        <div className="share-button-container">
            <button 
                className="share-button"
                onClick={() => setShowMenu(!showMenu)}
            >
                <FaShare />
            </button>
            
            {showMenu && (
                <div className="share-menu">
                    {shareOptions.map((option, index) => (
                        <button
                            key={index}
                            className="share-option"
                            onClick={option.action}
                        >
                            {option.icon}
                            <span>{option.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

ShareButton.propTypes = {
    advertisementId: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired
};

export default ShareButton; 