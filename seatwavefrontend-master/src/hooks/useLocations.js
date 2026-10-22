// src/hooks/useLocations.js
import { useState, useEffect } from 'react';
import { getLocations } from '../api/locationApi';

export function useLocations() {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let active = true;
        getLocations()
            .then(data => { if (active) setLocations(data); })
            .catch(err => { if (active) setError(err.message); })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, []);

    return { locations, setLocations, loading, error };
}