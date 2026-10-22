// src/pages/AdminPage.jsx
import '../../styles/ConcertsPage.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConcertCard from '../../components/concerts/ConcertCard.jsx';
import { useConcerts } from '../../hooks/useConcerts.js';

const AdminPage = () => {
    const { concerts, setConcerts, loading, error } = useConcerts();
    const navigate = useNavigate();
    const [searchId, setSearchId] = useState('');

    const onEdit = (concert) => navigate(`/concerts/${concert.id}/edit`);
    const onDeleted = (id) => setConcerts(prev => prev.filter(c => c.id !== id));

    const visible = searchId.trim()
        ? concerts.filter(c => String(c.id) === searchId.trim())
        : concerts;

    return (
        <div className="page-wrapper" style={{ padding: '2rem' }}>
            <div className="concert-container">
                <button type="button" className="book-button"
                        onClick={() => navigate('/concerts/add')}>
                    + New Concert
                </button>
                <section className="concert-main">
                    <div className="info-card">
                        <h3>Find by ID</h3>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
                            <div className="input-group" style={{ flex: 1 }}>
                                <label>Concert ID</label>
                                <input type="number" min="1" value={searchId}
                                       onChange={(e) => setSearchId(e.target.value)}
                                       placeholder="e.g. 5" />
                            </div>
                            {searchId && (
                                <button type="button" className="book-button"
                                        style={{ background: 'rgba(27, 58, 107, 0.5)', border: '1px solid rgba(78, 166, 255, 0.25)', boxShadow: 'none' }}
                                        onClick={() => setSearchId('')}>
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                </section>

                {loading ? <div>Loading concerts…</div>
                    : error ? <div>Error getting concerts: {error}</div>
                        : visible.length === 0 ? <div>No concert matches id {searchId}.</div>
                            : <div className="concert-grid">
                                {visible.map(concert => (
                                    <ConcertCard key={concert.id} concert={concert}
                                                 admin onEdit={onEdit} onDeleted={onDeleted} />
                                ))}
                            </div>}
            </div>
        </div>
    );
};

export default AdminPage;