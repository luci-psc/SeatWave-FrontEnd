// src/pages/LocationsPage.jsx
import LocationsList from '../../components/locations/LocationsList.jsx';
import { useNavigate } from 'react-router-dom';

const LocationsPage = () => {
    const navigate = useNavigate();
    return (
        <div className="page-wrapper" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                <button type="button" className="book-button" onClick={() => navigate('/locations/add')}>
                    + New location
                </button>
            </div>
            <LocationsList />
        </div>
    );
};

export default LocationsPage;