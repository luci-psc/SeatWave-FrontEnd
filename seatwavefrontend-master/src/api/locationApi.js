// src/api/locationApi.js
import { request } from './client';

export function getLocations() {
    return request('/locations').then(data => data.locations ?? data);
}

// GET /locations/{id} -> single LocationDTO
export function getLocationById(id) {
    return request(`/locations/${id}`);
}

// POST /locations -> created LocationDTO (note: backend returns id-only)
export function createLocation(payload) {
    return request('/locations', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}

// PUT /locations/{id} -> full updated LocationDTO
export function updateLocation(id, payload) {
    return request(`/locations/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
    });
}

// DELETE /locations/{id} -> 204 No Content
export function deleteLocation(id) {
    return request(`/locations/${id}`, { method: 'DELETE' });
}