// src/components/locations/LocationsList.jsx
import LocationCard from './LocationCard.jsx';
import { useLocations } from '../../hooks/useLocations';
import { useNavigate } from 'react-router-dom';

const LocationsList = () => {
    const { locations, setLocations, loading, error } = useLocations();
    const navigate = useNavigate();

    if (loading) return <div>Loading locations…</div>;
    if (error) return <div>Error getting locations: {error}</div>;
    if (locations.length === 0) return <div>No locations yet. Create one to get started.</div>;

    return (
        <div className="concert-grid">
            {locations.map(location => (
                <LocationCard
                    key={location.id}
                    location={location}
                    onEdit={() => navigate(`/locations/${location.id}/edit`)}
                    onDeleted={(id) => setLocations(prev => prev.filter(l => l.id !== id))}
                />
            ))}
        </div>
    );
};

export default LocationsList;