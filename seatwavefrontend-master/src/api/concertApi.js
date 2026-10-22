// src/api/concertApi.js
import { request } from './client';

export function getConcerts() {
    return request('/concerts').then(data => data.concerts ?? data);
}

export function createConcert(payload) {
    return request('/concerts', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}

export function getConcertById(id) {
    return request(`/concerts/${id}`);
}
export function updateConcert(id, payload) {
    return request(`/concerts/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
}

export function deleteConcert(id) {
    return request(`/concerts/${id}`, { method: 'DELETE' });
}