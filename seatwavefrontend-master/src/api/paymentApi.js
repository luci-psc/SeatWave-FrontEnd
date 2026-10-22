// src/api/paymentApi.js
import { request } from './client';

export function processPayment(payload) {
    return request('/payments', {
        method: 'POST',
        body: JSON.stringify({
            ...payload,
            cardNumber: payload.cardNumber.replace(/\s/g, ''),
        }),
    });
}