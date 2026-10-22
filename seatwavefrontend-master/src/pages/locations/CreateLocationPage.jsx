// src/pages/CreateLocationPage.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LocationForm from '../../components/locations/LocationForm.jsx';
import { useLocationForm } from '../../hooks/useLocationForm.js';

const CreateLocationPage = () => {
    const navigate = useNavigate();
    const form = useLocationForm();

    // After a successful create, go back to the list
    useEffect(() => {
        if (form.status.success) {
            const t = setTimeout(() => navigate('/locations'), 600);
            return () => clearTimeout(t);
        }
    }, [form.status.success, navigate]);

    return (
        <div className="concert-container">
            <header className="concert-header">
                <h1>New location</h1>
            </header>
            <section className="concert-main">
                <LocationForm {...form} />
            </section>
        </div>
    );
};

export default CreateLocationPage;