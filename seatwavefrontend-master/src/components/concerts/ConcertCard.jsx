import '../../styles/ConcertsPage.css';
import { useState } from 'react';
import { deleteConcert } from '../../api/concertApi';
const eur = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' });
import { useAuth } from '../../auth/AuthContext.jsx';
import PurchaseModal from './PurchaseModal.jsx';

const ConcertCard = ({ concert, admin = false, onEdit, onDeleted }) => {
    const { id, title, location, startingDay, startingHour, description, tickets } = concert;
    const [confirming, setConfirming] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(null);
    const { isLoggedIn } = useAuth();
    const [buying, setBuying] = useState(false);
    const tiers = Object.values(
        (tickets ?? []).reduce((acc, t) => {
            const key = t.seatType || 'General';
            if (!acc[key]) {
                acc[key] = { seatType: key, price: t.price, total: 0, available: 0 };
            }
            acc[key].total += 1;
            if (t.ownerId == null) acc[key].available += 1;
            return acc;
        }, {})
    );

    const handleDelete = async () => {
        setBusy(true);
        setError(null);
        try {
            await deleteConcert(id);
            onDeleted?.(id);
        } catch (err) {
            setError(err.message);
            setBusy(false);
        }
    };
    const totalAvailable = tiers.reduce((sum, t) => sum + t.available, 0);
    const lowTotal = totalAvailable > 0 && totalAvailable < 5;

    return (
        <div className="concert-container">
            <header className="concert-header">
                <h1>{title}</h1>
                <div
                    className="badge"
                    style={lowTotal ? { color: 'var(--danger)', borderColor: 'var(--danger)' } : undefined}
                >
                    {totalAvailable} Tickets Left
                </div>            </header>

            <section className="concert-main">
                <div className="info-card">
                    <h3>Event Details</h3>
                    <p><strong>Venue:</strong> {location?.name || 'TBA'}</p>
                    <p><strong>Address:</strong> {location ? `${location.streetName} ${location.streetNumber}, ${location.city}, ${location.country}` : 'TBA'}</p>
                    <p><strong>Date:</strong> {startingDay}</p>
                    <p><strong>Doors Open:</strong> {startingHour}</p>
                </div>

                <div className="description-section">
                    <h3>About the Concert</h3>
                    <p>{description}</p>
                </div>

                <div className="tickets-section">
                    <h3>Available Ticket Tiers</h3>
                    <div className="ticket-grid">
                        {tiers.map(tier => {
                            const low = tier.available > 0 && tier.available < 5;
                            return (
                                <div key={tier.seatType} className="ticket-item">
                                    <span>{tier.seatType}</span>
                                    <strong>{eur.format(Number(tier.price))}</strong>
                                    <span style={{
                                        fontSize: '0.78rem',
                                        color: low ? 'var(--danger)' : 'var(--text-faint)',
                                        fontWeight: low ? 600 : 'normal',
                                    }}>
                {tier.available} of {tier.total} left
            </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {error && <div className="badge" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}>Error: {error}</div>}

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <button type="button" className="book-button" onClick={() => setBuying(true)}>Book Now</button>

                    {buying && (
                        <PurchaseModal
                            concert={concert}
                            isLoggedIn={isLoggedIn}
                            onClose={() => setBuying(false)}
                            onPurchased={() => { /* see note below */ }}
                        />
                    )}
                    {admin && (
                        <>
                            <button type="button" className="book-button"
                                    style={{ background: 'rgba(27, 58, 107, 0.5)', border: '1px solid rgba(78, 166, 255, 0.25)', boxShadow: 'none' }}
                                    onClick={() => onEdit?.(concert)}>
                                Edit
                            </button>

                            {!confirming ? (
                                <button type="button" className="book-button"
                                        style={{ background: 'transparent', border: '1px solid rgba(255, 93, 108, 0.5)', color: 'var(--danger)', boxShadow: 'none' }}
                                        onClick={() => setConfirming(true)}>
                                    Delete
                                </button>
                            ) : (
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <span style={{ color: 'var(--text-soft)', fontSize: '0.85rem' }}>Delete this concert?</span>
                                    <button type="button" className="book-button" disabled={busy}
                                            style={{ background: 'var(--danger)', boxShadow: 'none' }}
                                            onClick={handleDelete}>
                                        {busy ? 'Deleting…' : 'Yes, delete'}
                                    </button>
                                    <button type="button" className="book-button" disabled={busy}
                                            style={{ background: 'rgba(27, 58, 107, 0.5)', border: '1px solid rgba(78, 166, 255, 0.25)', boxShadow: 'none' }}
                                            onClick={() => setConfirming(false)}>
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    );
};

export default ConcertCard;