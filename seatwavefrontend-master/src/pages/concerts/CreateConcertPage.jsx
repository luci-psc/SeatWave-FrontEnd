import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/ConcertsPage.css';
import { createConcert } from '../../api/concertApi.js';
import { getLocations } from '../../api/locationApi.js';
import { getSeatTypes } from '../../api/seatTypeApi.js';

const EMPTY_TIER = (seatType = '') => ({ seatType, price: '', quantity: '' });

const CreateConcertPage = () => {
    const navigate = useNavigate();

    const [locations, setLocations] = useState([]);
    const [loadingLocations, setLoadingLocations] = useState(true);
    const [seatTypes, setSeatTypes] = useState([]);

    const [formData, setFormData] = useState({
        title: '',
        locationId: '',
        startingDay: '',
        startingHour: '',
        description: '',
    });
    // each tier: { seatType, price, quantity }
    const [tiers, setTiers] = useState([EMPTY_TIER()]);
    const [status, setStatus] = useState({ loading: false, error: null, success: false });

    useEffect(() => {
        getLocations()
            .then(setLocations)
            .catch(() => {})
            .finally(() => setLoadingLocations(false));

        getSeatTypes()
            .then(types => {
                setSeatTypes(types);
                if (types.length > 0) setTiers([EMPTY_TIER(types[0])]);
            })
            .catch(() => {});
    }, []);

    const selectedLocation = locations.find(
        l => l.id === parseInt(formData.locationId, 10)
    ) ?? null;
    const locationCapacity = selectedLocation?.seatCapacity ?? null;

    const updateField = (name, value) => setFormData(prev => ({ ...prev, [name]: value }));

    const updateTier = (index, field, value) =>
        setTiers(prev => prev.map((t, i) => (i === index ? { ...t, [field]: value } : t)));

    const addTier = () => setTiers(prev => [...prev, EMPTY_TIER(seatTypes[0] ?? '')]);

    const removeTier = (index) =>
        setTiers(prev => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)));

    // live total so the admin sees the capacity that will be generated
    const totalSeats = tiers.reduce((sum, t) => sum + (parseInt(t.quantity, 10) || 0), 0);
    const capacityExceeded = locationCapacity !== null && totalSeats > locationCapacity;

    const submit = async (e) => {
        e.preventDefault();
        if (!formData.locationId) {
            setStatus({ loading: false, error: 'Please select a location.', success: false });
            return;
        }
        if (totalSeats <= 10) {
            setStatus({ loading: false, error: 'A concert must have more than 10 seats in total.', success: false });
            return;
        }

        if (capacityExceeded) {
            setStatus({
                loading: false,
                error: `Total seats (${totalSeats}) exceeds this location's capacity of ${locationCapacity}.`,
            });
            return;
        }
        setStatus({ loading: true, error: null, success: false });

        const payload = {
            ...formData,
            locationId: parseInt(formData.locationId, 10),
            // each tier becomes a TicketDTO with seatType + price + quantity;
            // the backend explodes each into `quantity` individual seats
            tickets: tiers.map(t => ({
                seatType: t.seatType,
                price: parseFloat(t.price),
                quantity: parseInt(t.quantity, 10),
            })),
        };

        try {
            await createConcert(payload);     // goes through client.js (auth cookie + CSRF)
            navigate('/admin');               // back to the admin dashboard
        } catch (err) {
            setStatus({ loading: false, error: err.message, success: false });
        }
    };

    return (
        <div className="page-wrapper" style={{ padding: '2rem' }}>
            <div className="concert-container">
                <header className="concert-header">
                    <h1>Add New Concert</h1>
                    <button type="button" className="badge" style={{ cursor: 'pointer' }}
                            onClick={() => navigate('/admin')}>← Back</button>
                </header>

                <section className="concert-main">
                    {status.error && <div className="badge" style={{ marginBottom: '1rem', borderColor: 'var(--danger)', color: 'var(--danger)' }}>Error: {status.error}</div>}

                    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="input-group">
                            <label>Concert Title:</label>
                            <input type="text" value={formData.title} placeholder="e.g. Summer Night Live"
                                   onChange={(e) => updateField('title', e.target.value)} required />
                        </div>

                        <div className="input-group">
                            <label>Location:</label>
                            <select value={formData.locationId}
                                    onChange={(e) => updateField('locationId', e.target.value)} required>
                                <option value="" disabled>
                                    {loadingLocations ? 'Loading locations…' : 'Select a Location'}
                                </option>
                                {locations.map(loc => (
                                    <option key={loc.id} value={loc.id}>{loc.name} ({loc.city})</option>
                                ))}
                            </select>
                        </div>
                        <div className="input-group">
                            <label>Location Capacity:</label>
                            <input type="text" readOnly disabled
                                   value={locationCapacity !== null ? `${locationCapacity} seats` : 'Select a location'}
                                   style={{ background: '#2a2a2a', color: 'var(--text-soft)', cursor: 'not-allowed' }} />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div className="input-group" style={{ flex: 1 }}>
                                <label>Date:</label>
                                <input type="date" value={formData.startingDay}
                                       onChange={(e) => updateField('startingDay', e.target.value)}
                                       required max="2100-12-31" />
                            </div>
                            <div className="input-group" style={{ flex: 1 }}>
                                <label>Doors Open:</label>
                                <input type="time" value={formData.startingHour}
                                       onChange={(e) => updateField('startingHour', e.target.value)} required />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Description:</label>
                            <textarea rows="4" value={formData.description} placeholder="Tell people what to expect…"
                                      onChange={(e) => updateField('description', e.target.value)} required />
                        </div>

                        <div className="tickets-section">
                            <h3>Ticket Tiers</h3>
                            {tiers.map((tier, index) => (
                                <div key={index} style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                                    <select value={tier.seatType}
                                            onChange={(e) => updateTier(index, 'seatType', e.target.value)} required
                                            style={{ flex: 2 }}>
                                        {seatTypes.map(st => (
                                            <option key={st} value={st}>
                                                {st.charAt(0) + st.slice(1).toLowerCase()}
                                            </option>
                                        ))}
                                    </select>
                                    <input type="number" step="0.01" min="0" placeholder="Price in €"
                                           value={tier.price}
                                           onChange={(e) => updateTier(index, 'price', e.target.value)} required
                                           style={{ flex: 1 }} />
                                    <input type="number" min="1" placeholder="e.g. 50"
                                           value={tier.quantity}
                                           onChange={(e) => updateTier(index, 'quantity', e.target.value)} required
                                           style={{ flex: 1 }} />
                                    <button type="button" onClick={() => removeTier(index)}
                                            disabled={tiers.length === 1}
                                            title="Remove tier"
                                            style={{ background: 'transparent', border: '1px solid rgba(255,93,108,0.5)', color: 'var(--danger)', borderRadius: '8px', cursor: tiers.length === 1 ? 'not-allowed' : 'pointer', padding: '0.4rem 0.7rem' }}>
                                        ✕
                                    </button>
                                </div>
                            ))}
                            <button type="button" onClick={addTier} style={{ marginTop: '0.5rem', cursor: 'pointer' }}>
                                + Add Ticket Tier
                            </button>

                            <p style={{ marginTop: '0.75rem', color: 'var(--text-soft)', fontSize: '0.9rem' }}>
                                Total capacity: <strong>{totalSeats}</strong> seat{totalSeats === 1 ? '' : 's'}
                            </p>
                        </div>

                        <button type="submit" className="book-button" disabled={status.loading} style={{ marginTop: '1.5rem' }}>
                            {status.loading ? 'Creating…' : 'Create Concert'}
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
};

export default CreateConcertPage;
