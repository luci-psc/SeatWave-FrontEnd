// src/components/locations/LocationCard.jsx
import '../../styles/ConcertsPage.css';
import { useState } from 'react';
import { deleteLocation } from '../../api/locationApi';

const LocationCard = ({ location, onEdit, onDeleted }) => {
    const { id, name, city, country, seatCapacity, streetName, streetNumber, postalCode } = location;
    const [confirming, setConfirming] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(null);

    const handleDelete = async () => {
        setBusy(true);
        setError(null);
        try {
            await deleteLocation(id);
            onDeleted?.(id);
        } catch (err) {
            setError(err.message);
            setBusy(false);
        }
    };

    return (
        <div className="concert-container">
            <header className="concert-header">
                <h1>{name}</h1>
                <div className="badge">{seatCapacity} seats</div>
            </header>

            <section className="concert-main">
                <div className="info-card">
                    <h3>Venue Details</h3>
                    <p><strong>City:</strong> {city}</p>
                    <p><strong>Country:</strong> {country}</p>
                    <p><strong>Address:</strong> {streetName} {streetNumber}</p>
                    <p><strong>Postal code:</strong> {postalCode}</p>
                </div>

                {error && (
                    <div className="badge" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}>
                        Error: {error}
                    </div>
                )}

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <button
                        type="button"
                        className="book-button"
                        style={{ background: 'rgba(27, 58, 107, 0.5)', border: '1px solid rgba(78, 166, 255, 0.25)', boxShadow: 'none' }}
                        onClick={() => onEdit?.(location)}
                    >
                        Edit
                    </button>

                    {!confirming ? (
                        <button
                            type="button"
                            className="book-button"
                            style={{ background: 'transparent', border: '1px solid rgba(255, 93, 108, 0.5)', color: 'var(--danger)', boxShadow: 'none' }}
                            onClick={() => setConfirming(true)}
                        >
                            Delete
                        </button>
                    ) : (
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-soft)', fontSize: '0.85rem' }}>Delete this location?</span>
                            <button
                                type="button"
                                className="book-button"
                                disabled={busy}
                                style={{ background: 'var(--danger)', boxShadow: 'none' }}
                                onClick={handleDelete}
                            >
                                {busy ? 'Deleting…' : 'Yes, delete'}
                            </button>
                            <button
                                type="button"
                                className="book-button"
                                disabled={busy}
                                style={{ background: 'rgba(27, 58, 107, 0.5)', border: '1px solid rgba(78, 166, 255, 0.25)', boxShadow: 'none' }}
                                onClick={() => setConfirming(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default LocationCard;