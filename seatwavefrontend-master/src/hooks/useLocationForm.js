import { useState, useEffect } from 'react';
import { createLocation, updateLocation, getLocationById } from '../api/locationApi';

const EMPTY_FORM = {
    name: '', city: '', country: '', seatCapacity: '',
    streetName: '', streetNumber: '', postalCode: '',
};

// Pass an id to edit an existing location; omit it to create a new one.
export function useLocationForm(id = null) {
    const isEdit = id != null;

    const [formData, setFormData] = useState(EMPTY_FORM);
    const [loadingExisting, setLoadingExisting] = useState(isEdit);
    const [status, setStatus] = useState({ loading: false, error: null, success: false });

    // When editing, load the current values into the form
    useEffect(() => {
        if (!isEdit) return;
        let active = true;
        getLocationById(id)
            .then(loc => {
                if (!active) return;
                setFormData({
                    name: loc.name ?? '',
                    city: loc.city ?? '',
                    country: loc.country ?? '',
                    seatCapacity: loc.seatCapacity ?? '',
                    streetName: loc.streetName ?? '',
                    streetNumber: loc.streetNumber ?? '',
                    postalCode: loc.postalCode ?? '',
                });
            })
            .catch(err => { if (active) setStatus(s => ({ ...s, error: err.message })); })
            .finally(() => { if (active) setLoadingExisting(false); });
        return () => { active = false; };
    }, [id, isEdit]);

    const updateField = (name, value) =>
        setFormData(prev => ({ ...prev, [name]: value }));

    const submit = async () => {
        setStatus({ loading: true, error: null, success: false });

        const payload = {
            ...formData,
            seatCapacity: parseInt(formData.seatCapacity, 10),
        };

        try {
            if (isEdit) {
                await updateLocation(id, payload);
            } else {
                await createLocation(payload);
            }
            setStatus({ loading: false, error: null, success: true });
            if (!isEdit) setFormData(EMPTY_FORM);
        } catch (err) {
            setStatus({ loading: false, error: err.message, success: false });
        }
    };

    return { isEdit, formData, loadingExisting, status, updateField, submit };
}