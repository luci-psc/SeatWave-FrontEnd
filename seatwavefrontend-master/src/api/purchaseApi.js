// src/api/purchaseApi.js
import { request } from './client';

export function purchaseTickets(concertId, { quantity, seatType }) {
    return request(`/concerts/${concertId}/purchase`, {
        method: 'POST',
        body: JSON.stringify({ quantity, seatType }),
    });
}