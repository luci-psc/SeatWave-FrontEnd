// src/hooks/useConcertForm.js
import { useState, useEffect } from 'react';
import { getLocations } from '../api/locationApi';
import { getSeatTypes } from '../api/seatTypeApi';
import { createConcert } from '../api/concertApi';

const EMPTY_FORM = {
    title: '', numberOfTickets: '', locationId: '',
    startingDay: '', startingHour: '', description: '',
};

export function useConcertForm() {
    const [locations, setLocations] = useState([]);
    const [seatTypes, setSeatTypes] = useState([]);
    const [loadingLocations, setLoadingLocations] = useState(true);

    const [formData, setFormData] = useState(EMPTY_FORM);
    const [tickets, setTickets] = useState([{ type: '', price: '' }]);
    const [status, setStatus] = useState({ loading: false, error: null, success: false });

    useEffect(() => {
        getLocations()
            .then(setLocations)
            .catch(err => console.error('Error fetching locations:', err))
            .finally(() => setLoadingLocations(false));

        getSeatTypes()
            .then(data => {
                setSeatTypes(data);
                if (data.length > 0) setTickets([{ type: data[0], price: '' }]);
            })
            .catch(err => console.error('Error fetching seat types:', err));
    }, []);

    const updateField = (name, value) =>
        setFormData(prev => ({ ...prev, [name]: value }));

    const updateTicket = (index, field, value) =>
        setTickets(prev => prev.map((t, i) => (i === index ? { ...t, [field]: value } : t)));

    const addTicket = () => setTickets(prev => [...prev, { type: seatTypes[0] ?? '', price: '' }]);

    const submit = async () => {
        if (!formData.locationId) {
            setStatus({ loading: false, error: 'Please select a location.', success: false });
            return;
        }
        setStatus({ loading: true, error: null, success: false });

        const payload = {
            ...formData,
            numberOfTickets: parseInt(formData.numberOfTickets, 10),
            locationId: parseInt(formData.locationId, 10),
            tickets: tickets.map(t => ({ seatType: t.type, price: parseFloat(t.price) })),
        };

        try {
            await createConcert(payload);
            setStatus({ loading: false, error: null, success: true });
            setFormData(EMPTY_FORM);
            setTickets([{ type: seatTypes[0] ?? '', price: '' }]);
        } catch (err) {
            setStatus({ loading: false, error: err.message, success: false });
        }
    };

    return {
        locations, seatTypes, loadingLocations,
        formData, tickets, status,
        updateField, updateTicket, addTicket, submit,
    };
}