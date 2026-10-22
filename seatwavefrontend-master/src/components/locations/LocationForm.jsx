// src/components/locations/LocationForm.jsx
import '../../styles/ConcertsPage.css';

const LocationForm = ({ isEdit, formData, status, updateField, submit }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        submit();
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {status.success && (
                <div className="badge" style={{ background: '#2ecc71', marginBottom: '1rem' }}>
                    {isEdit ? 'Location updated.' : 'Location created.'}
                </div>
            )}
            {status.error && (
                <div className="badge" style={{ marginBottom: '1rem' }}>Error: {status.error}</div>
            )}

            <div className="input-group">
                <label>Venue name</label>
                <input type="text" value={formData.name} placeholder="e.g. Ziggo Dome"
                       onChange={(e) => updateField('name', e.target.value)} required />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="input-group" style={{ flex: 1 }}>
                    <label>City</label>
                    <input type="text" value={formData.city} placeholder="e.g. Amsterdam"
                           onChange={(e) => updateField('city', e.target.value)} required />
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                    <label>Country</label>
                    <input type="text" value={formData.country} placeholder="e.g. Netherlands"
                           onChange={(e) => updateField('country', e.target.value)} required />
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="input-group" style={{ flex: 2 }}>
                    <label>Street name</label>
                    <input type="text" value={formData.streetName} placeholder="e.g. De Passage"
                           onChange={(e) => updateField('streetName', e.target.value)} required />
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                    <label>Street number</label>
                    <input type="text" value={formData.streetNumber} placeholder="e.g. 100"
                           onChange={(e) => updateField('streetNumber', e.target.value)} required />
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="input-group" style={{ flex: 1 }}>
                    <label>Postal code</label>
                    <input type="text" value={formData.postalCode}
                           onChange={(e) => updateField('postalCode', e.target.value.toUpperCase())}
                           placeholder="1234AB" required />
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                    <label>Seat capacity</label>
                    <input type="number" min="1" value={formData.seatCapacity} placeholder="e.g. 500"
                           onChange={(e) => updateField('seatCapacity', e.target.value)} required />
                </div>
            </div>

            <button type="submit" className="book-button" disabled={status.loading} style={{ marginTop: '1.5rem' }}>
                {status.loading
                    ? (isEdit ? 'Saving…' : 'Creating…')
                    : (isEdit ? 'Save changes' : 'Create location')}
            </button>
        </form>
    );
};

export default LocationForm;