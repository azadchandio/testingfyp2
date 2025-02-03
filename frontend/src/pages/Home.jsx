import { useState, useEffect } from 'react';
import { advertisementService } from '../services/advertisement.service';
import AdvertisementCard from '../components/Advertisement/AdvertisementCard';
import Categories from '../components/category/Categories';
import Products from '../components/prodcuts/Products'
import './Home.css';

const Home = () => {
    const [featuredAds, setFeaturedAds] = useState([]);
    const [recentAds, setRecentAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const [featured, recent] = await Promise.all([
                    advertisementService.getFeaturedAds(),
                    advertisementService.getAllAdvertisements()
                ]);
                setFeaturedAds(featured);
                setRecentAds(recent);
            } catch (err) {
                setError('Failed to load advertisements');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAds();
    }, []);

    return (
        <>
            <Categories />
            {/* <Products /> */}
            <div className="home-container">
                {loading && <div className="loading-spinner">Loading...</div>}
                {error && <div className="error-message">{error}</div>}
                
                {featuredAds.length > 0 && (
                    <section className="featured-section">
                        <h2 className="section-title">
                            Featured Listings<span className="dot">.</span>
                        </h2>
                        <div className="products-grid">
                            {featuredAds.map(ad => (
                                <AdvertisementCard key={ad.id} advertisement={ad} />
                            ))}
                        </div>
                    </section>
                )}

                <section className="recent-section">
                    <h2 className="section-title">
                        Recent Listings<span className="dot">.</span>
                    </h2>
                    <div className="products-grid">
                        {recentAds.map(ad => (
                            <AdvertisementCard key={ad.id} advertisement={ad} />
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
};

export default Home; 