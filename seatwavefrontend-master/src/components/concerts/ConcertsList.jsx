import ConcertCard from './ConcertCard.jsx';
import { useConcerts } from '../../hooks/useConcerts';
import { useNavigate } from 'react-router-dom';

const ConcertsList = () => {
    const { concerts, setConcerts, loading, error } = useConcerts();
    const navigate = useNavigate();

    if (loading) return <div>Loading concerts…</div>;
    if (error) return <div>Error getting concerts: {error}</div>;
    if (concerts.length === 0) return <div>No concerts available at the moment</div>;

    return (
        <div className="concert-grid">
            {concerts.map(concert => (
                <ConcertCard
                    key={concert.id}
                    concert={concert}
                    onEdit={() => navigate(`/concerts/${concert.id}/edit`)}
                    onDeleted={(id) => setConcerts(prev => prev.filter(c => c.id !== id))} />
            ))}
        </div>
    );
};

export default ConcertsList;