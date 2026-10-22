import '../../styles/ConcertsPage.css';

const ConcertForm = ({
                         locations, seatTypes, loadingLocations,
                         formData, tickets, status,
                         updateField, updateTicket, addTicket, submit,
                     }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        submit();
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {status.success && <div className="badge" style={{ background: '#2ecc71', marginBottom: '1rem' }}>Concert created successfully!</div>}
            {status.error && <div className="badge" style={{ marginBottom: '1rem' }}>Error: {status.error}</div>}

            <div className="input-group">
                <label>Concert Title:</label>
                <input type="text" placeholder="e.g. Summer Night Live" value={formData.title}
                       onChange={(e) => updateField('title', e.target.value)} required />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="input-group" style={{ flex: 1 }}>
                    <label>Location Capacity:</label>
                    <input type="text" readOnly disabled
                           value={
                               (() => {
                                   const loc = locations.find(l => String(l.id) === String(formData.locationId));
                                   return loc ? `${loc.seatCapacity} seats` : 'Select a location';
                               })()
                           }
                           style={{ background: '#2a2a2a', color: 'var(--text-soft)', cursor: 'not-allowed' }} />
                </div>

                <div className="input-group" style={{ flex: 1 }}>
                    <label>Location:</label>
                    <select value={formData.locationId}
                            onChange={(e) => updateField('locationId', e.target.value)} required
                            style={{ padding: '8px', borderRadius: '4px', background: '#333', color: 'white', border: '1px solid #555' }}>
                        <option value="" disabled>
                            {loadingLocations ? 'Loading locations…' : 'Select a Location'}
                        </option>
                        {locations.map(loc => (
                            <option key={loc.id} value={loc.id}>{loc.name} ({loc.city})</option>
                        ))}
                    </select>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="input-group" style={{ flex: 1 }}>
                    <label>Date:</label>
                    <input type="date" value={formData.startingDay}
                           onChange={(e) => updateField('startingDay', e.target.value)}
                           required
                           max="2100-12-31" />
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                    <label>Doors Open:</label>
                    <input type="time" value={formData.startingHour}
                           onChange={(e) => updateField('startingHour', e.target.value)} required />
                </div>
            </div>

            <div className="input-group">
                <label>Description:</label>
                <textarea rows="4" value={formData.description}
                          onChange={(e) => updateField('description', e.target.value)}
                          placeholder="Tell people what to expect…" required />
            </div>

            <div className="tickets-section">
                <h3>Ticket Tiers</h3>
                {tickets.map((ticket, index) => (
                    <div key={index} style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                        <select value={ticket.type}
                                onChange={(e) => updateTicket(index, 'type', e.target.value)} required
                                style={{ padding: '8px', borderRadius: '4px', background: '#333', color: 'white', border: '1px solid #555', flex: 1 }}>
                            {seatTypes.map(seatType => (
                                <option key={seatType} value={seatType}>
                                    {seatType.charAt(0) + seatType.slice(1).toLowerCase()}
                                </option>
                            ))}
                        </select>
                        <input type="number" step="0.01" placeholder="Price" value={ticket.price}
                               onChange={(e) => updateTicket(index, 'price', e.target.value)} required
                               style={{ flex: 1 }} />
                    </div>
                ))}
                <button type="button" onClick={addTicket} style={{ marginTop: '0.5rem', cursor: 'pointer' }}>
                    + Add Ticket Tier
                </button>
            </div>

            <button type="submit" className="book-button" disabled={status.loading} style={{ marginTop: '1.5rem' }}>
                {status.loading ? 'Creating…' : 'Create Concert'}
            </button>
        </form>
    );
};

export default ConcertForm;