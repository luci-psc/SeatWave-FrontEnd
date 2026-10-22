import '../../styles/ConcertsPage.css';
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getMyProfile, getMyTickets } from '../../api/customerApi.js';
import { useAuth } from '../../auth/AuthContext.jsx';

const ProfilePage = () => {
    const { isAdmin, isLoggedIn } = useAuth();
    const [profile, setProfile] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [ticketsError, setTicketsError] = useState(null);
    const [error, setError]     = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMyProfile()
            .then(setProfile)
            .catch(() => setError('Could not load your profile. Please try again.'))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        getMyTickets()
            .then(data => setTickets(data ?? []))
            .catch(() => setTicketsError('Could not load your tickets.'));
    }, []);

    // Logged out (e.g. via the navbar button) — leave the page immediately.
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    if (loading) return (
        <div className="concert-container">
            <p style={{ color: 'var(--text-soft)', textAlign: 'center', marginTop: '3rem' }}>
                Loading your profile…
            </p>
        </div>
    );

    if (error) return (
        <div className="concert-container">
            <p style={{ color: 'var(--danger)', textAlign: 'center', marginTop: '3rem' }}>
                {error}
            </p>
        </div>
    );

    const initials = `${profile.firstName?.[0] ?? ''}${profile.lastName?.[0] ?? ''}`.toUpperCase();
    const roleLabel = isAdmin ? 'Admin' : 'Customer';

    const formatDate = (date, time) => {
        if (!date) return '';
        const d = new Date(`${date}T${time ?? '00:00'}`);
        return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
            + (time ? `, ${time.slice(0, 5)}` : '');
    };

    return (
        <div className="concert-container">

            {/* ── Header ── */}
            <div className="concert-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', position: 'relative', zIndex: 1 }}>
                    <div style={{
                        width: '56px', height: '56px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--wave), var(--crest))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'var(--font-display)', fontWeight: 700,
                        fontSize: '1.3rem', color: '#fff',
                        flexShrink: 0,
                        boxShadow: '0 4px 16px rgba(47, 111, 212, 0.5)',
                    }}>
                        {initials}
                    </div>
                    <div>
                        <h1 style={{ margin: 0 }}>{profile.firstName} {profile.lastName}</h1>
                        <p style={{ margin: '0.2rem 0 0', color: 'var(--foam)', fontSize: '0.9rem', position: 'relative', zIndex: 1 }}>
                            {profile.email}
                        </p>
                    </div>
                </div>
                <span
                    className="badge"
                    style={{
                        position: 'relative',
                        zIndex: 1,
                        ...(isAdmin ? {
                            background: 'rgba(47, 212, 167, 0.15)',
                            borderColor: 'rgba(47, 212, 167, 0.5)',
                            color: 'var(--success)',
                        } : {}),
                    }}
                >
                    {roleLabel}
                </span>
            </div>

            {/* ── Details ── */}
            <div className="concert-main">
                <div className="info-card">
                    <h3>Account details</h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <p style={{ margin: 0 }}>
                                <span style={{ color: 'var(--text-faint)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                    First name
                                </span>
                            </p>
                            <p style={{ margin: '0.2rem 0 0' }}>
                                <strong>{profile.firstName}</strong>
                            </p>
                        </div>

                        <div>
                            <p style={{ margin: 0 }}>
                                <span style={{ color: 'var(--text-faint)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                    Last name
                                </span>
                            </p>
                            <p style={{ margin: '0.2rem 0 0' }}>
                                <strong>{profile.lastName}</strong>
                            </p>
                        </div>

                        <div>
                            <p style={{ margin: 0 }}>
                                <span style={{ color: 'var(--text-faint)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                    Email
                                </span>
                            </p>
                            <p style={{ margin: '0.2rem 0 0' }}>
                                <strong>{profile.email}</strong>
                            </p>
                        </div>

                        <div>
                            <p style={{ margin: 0 }}>
                                <span style={{ color: 'var(--text-faint)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                    Age
                                </span>
                            </p>
                            <p style={{ margin: '0.2rem 0 0' }}>
                                <strong>{profile.age}</strong>
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── My Tickets ── */}
                <div className="tickets-section">
                    <h3>My Tickets</h3>

                    {ticketsError && (
                        <p style={{ color: 'var(--danger)', margin: '0.5rem 0 0' }}>{ticketsError}</p>
                    )}

                    {!ticketsError && tickets.length === 0 && (
                        <p style={{ color: 'var(--text-soft)', margin: '0.5rem 0 0' }}>
                            You haven't booked any tickets yet. Browse concerts to grab your first seat.
                        </p>
                    )}

                    {tickets.length > 0 && (
                        <div className="ticket-grid">
                            {tickets.map(t => (
                                <div className="ticket-item" key={t.ticketId}>
                                    <span>{t.concertTitle}</span>
                                    {t.venueName && (
                                        <span style={{ color: 'var(--text-soft)', textTransform: 'none', letterSpacing: 0 }}>
                                            {t.venueName}
                                        </span>
                                    )}
                                    {(t.venueStreetName || t.venueCity) && (
                                        <span style={{ color: 'var(--text-faint)', textTransform: 'none', letterSpacing: 0, fontSize: '0.72rem' }}>
                                            {[
                                                [t.venueStreetName, t.venueStreetNumber].filter(Boolean).join(' '),
                                                t.venuePostalCode,
                                                t.venueCity,
                                                t.venueCountry,
                                            ].filter(Boolean).join(', ')}
                                        </span>
                                    )}
                                    <strong>{t.seatIdentifier}</strong>
                                    <span>{t.seatType}</span>
                                    <span>{formatDate(t.concertDate, t.concertTime)}</span>
                                    <span style={{ color: 'var(--foam)' }}>€{t.price.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default ProfilePage;