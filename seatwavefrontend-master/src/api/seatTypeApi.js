// src/api/seatTypeApi.js
import { request } from './client';

export function getSeatTypes() {
    return request('/seat-types');
}