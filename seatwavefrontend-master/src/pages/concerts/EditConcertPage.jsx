// src/pages/EditConcertPage.jsx
import '../../styles/ConcertsPage.css';
import ConcertForm from '../../components/concerts/ConcertForm.jsx';
import { getLocations } from '../../api/locationApi.js';
import { getSeatTypes } from '../../api/seatTypeApi.js';
import { getConcertById, updateConcert } from '../../api/concertApi.js';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Loader: fetch the concert by URL id, then render the form once it's here
const EditConcertPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [concert, setConcert] = useState(null);
    const [loadError, setLoadError] = useState(null);

    useEffect(() => {
        getConcertById(id)
            .then(setConcert)
            .catch(err => setLoadError(err.message));
    }, [id]);

    if (loadError) return <div style={{ padding: '2rem' }}>Could not load concert: {loadError}</div>;
    if (!concert) return <div style={{ padding: '2rem' }}>Loading…</div>;

    // key={concert.id} guarantees a fresh form instance per concert,
    // so the form's useState initializers re-run when the id changes
    return <EditConcertForm key={concert.id} concert={concert} navigate={navigate} />;
};

// Form: only ever mounted with a real concert, so initializers can read it safely
const EditConcertForm = ({ concert, navigate }) => {
    const [locations, setLocations] = useState([]);
    const [seatTypes, setSeatTypes] = useState([]);
    const [loadingLocations, setLoadingLocations] = useState(true);

    const [formData, setFormData] = useState({
        title: concert.title,
        locationId: String(concert.location?.id ?? ''),
        startingDay: concert.startingDay,
        startingHour: concert.startingHour?.slice(0, 5) ?? '',   // "20:00:00" -> "20:00"
        description: concert.description,
    });
    const [tickets, setTickets] = useState(() => {
        const byType = new Map();
        for (const t of concert.tickets) {
            if (!byType.has(t.seatType)) {
                byType.set(t.seatType, { type: t.seatType, price: String(t.price) });
            }
        }
        return [...byType.values()];
    });
    const [status, setStatus] = useState({ loading: false, error: null, success: false });

    useEffect(() => {
        getLocations().then(setLocations).catch(() => {}).finally(() => setLoadingLocations(false));
        getSeatTypes().then(setSeatTypes).catch(() => {});
    }, []);

    const updateField = (name, value) => setFormData(prev => ({ ...prev, [name]: value }));
    const updateTicket = (i, field, value) =>
        setTickets(prev => prev.map((t, idx) => (idx === i ? { ...t, [field]: value } : t)));
    const addTicket = () => setTickets(prev => [...prev, { type: seatTypes[0] ?? '', price: '' }]);

    const submit = async () => {
        setStatus({ loading: true, error: null, success: false });
        const payload = {
            id: concert.id,
            ...formData,
            locationId: parseInt(formData.locationId, 10),
            tickets: tickets.map(t => ({ seatType: t.type, price: parseFloat(t.price) })),
        };
        try {
            await updateConcert(concert.id, payload);
            navigate('/concerts');               // back to the list on success
        } catch (err) {
            setStatus({ loading: false, error: err.message, success: false });
        }
    };

    return (
        <div className="page-wrapper" style={{ padding: '2rem' }}>
            <div className="concert-container">
                <header className="concert-header">
                    <h1>Edit Concert</h1>
                    <button type="button" className="badge" style={{ cursor: 'pointer' }}
                            onClick={() => navigate('/concerts')}>
                        ← Back
                    </button>
                </header>
                <section className="concert-main">
                    <ConcertForm
                        locations={locations}
                        seatTypes={seatTypes}
                        loadingLocations={loadingLocations}
                        formData={formData}
                        tickets={tickets}
                        status={status}
                        updateField={updateField}
                        updateTicket={updateTicket}
                        addTicket={addTicket}
                        submit={submit}
                    />
                </section>
            </div>
        </div>
    );
};

export default EditConcertPage;