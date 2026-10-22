// src/pages/EditLocationPage.jsx
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LocationForm from '../../components/locations/LocationForm.jsx';
import { useLocationForm } from '../../hooks/useLocationForm.js';

const EditLocationPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const form = useLocationForm(Number(id));

    useEffect(() => {
        if (form.status.success) {
            const t = setTimeout(() => navigate('/locations'), 600);
            return () => clearTimeout(t);
        }
    }, [form.status.success, navigate]);

    if (form.loadingExisting) {
        return <div style={{ padding: '2rem' }}>Loading location…</div>;
    }

    return (
        <div className="concert-container">
            <header className="concert-header">
                <h1>Edit location</h1>
            </header>
            <section className="concert-main">
                <LocationForm {...form} />
            </section>
        </div>
    );
};

export default EditLocationPage;