// src/hooks/usePaymentForm.js
import { useState } from 'react';
import { processPayment } from '../api/paymentApi';

const EMPTY = {
    cardHolderName: '',
    cardNumber: '',
    expiryDate: '',   // displayed as MM/YY; split on submission
    cvv: '',
};

// ── card-type detection from leading digits ───────────────────────────────────
export function detectCardType(rawNumber) {
    const digits = rawNumber.replace(/\D/g, '');
    if (/^4/.test(digits))                              return 'visa';
    if (/^(5[1-5]|2[2-7]\d{2})/.test(digits))         return 'mastercard';
    if (/^3[47]/.test(digits))                          return 'amex';
    return null;
}

// ── formatting ────────────────────────────────────────────────────────────────
export function formatCardNumber(value) {
    const digits = value.replace(/\D/g, '');
    // Amex uses 4-6-5; everything else uses 4-4-4-4
    const isAmex = /^3[47]/.test(digits);
    if (isAmex) {
        return [digits.slice(0, 4), digits.slice(4, 10), digits.slice(10, 15)]
            .filter(Boolean).join(' ');
    }
    return (digits.slice(0, 16).match(/.{1,4}/g) ?? []).join(' ');
}

export function formatExpiry(value) {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    return digits.length >= 3
        ? digits.slice(0, 2) + '/' + digits.slice(2)
        : digits;
}

// ── hook ─────────────────────────────────────────────────────────────────────
export function usePaymentForm({ concertId, quantity, seatType }) {
    const [form, setForm] = useState(EMPTY);
    const [status, setStatus] = useState({ loading: false, error: null, declineCode: null, done: null });

    const cardType = detectCardType(form.cardNumber);
    const maxCvvLength = cardType === 'amex' ? 4 : 3;

    const updateField = (name, raw) => {
        let value = raw;
        if (name === 'cardNumber') value = formatCardNumber(raw);
        if (name === 'expiryDate') value = formatExpiry(raw);
        if (name === 'cvv') value = raw.replace(/\D/g, '').slice(0, maxCvvLength);
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const submit = async (e) => {
        e?.preventDefault();
        setStatus({ loading: true, error: null, declineCode: null, done: null });

        const [expiryMonth, expiryYear2] = form.expiryDate.split('/');
        const expiryYear = expiryYear2 ? '20' + expiryYear2 : '';

        try {
            const result = await processPayment({
                concertId,
                quantity,
                seatType,
                cardNumber: form.cardNumber,
                cardHolderName: form.cardHolderName,
                expiryMonth: expiryMonth ?? '',
                expiryYear,
                cvv: form.cvv,
            });
            setStatus({ loading: false, error: null, declineCode: null, done: result });
        } catch (err) {
            // The backend returns declineCode in the body for 402 errors.
            // Our client.js parses body.message and body.declineCode.
            setStatus({
                loading: false,
                error: err.message || 'Payment failed. Please try again.',
                declineCode: null, // declineCode is embedded in err.message via client.js
                done: null,
            });
        }
    };

    return { form, cardType, status, updateField, submit };
}