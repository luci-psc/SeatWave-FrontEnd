import { request } from './client';

export function getMyProfile() {
    return request('/customers/me', { method: 'GET' });
}

export function getMyTickets() {
    return request('/customers/me/tickets', { method: 'GET' });
}