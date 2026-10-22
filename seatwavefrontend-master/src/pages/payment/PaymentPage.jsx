// src/pages/PaymentPage.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { usePaymentForm } from '../../hooks/usePaymentForm.js';
import '../../styles/ConcertsPage.css';

const eur = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' });

// ── card-type badge ──────────────────────────────────────────────────────────
const CARD_LABELS = { visa: 'VISA', mastercard: 'MC', amex: 'AMEX' };

const CardBadge = ({ type }) =>
    type ? (
        <span style={{
            position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
            fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em',
            color: 'var(--crest)', padding: '0.15rem 0.45rem',
            border: '1px solid rgba(78,166,255,0.35)', borderRadius: '4px',
            background: 'rgba(6,13,28,0.6)',
        }}>
            {CARD_LABELS[type]}
        </span>
    ) : null;

// ── main page ────────────────────────────────────────────────────────────────
const PaymentPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    const { concert, quantity, seatType, unitPrice } = state;
    const totalWithVAT = unitPrice * quantity;
    const { form, cardType, status, updateField, submit } = usePaymentForm({
        concertId: concert.id,
        quantity,
        seatType,
    });
    // Guard: if the user navigated here directly without order info, send them back
    useEffect(() => {
        if (!state?.concert) navigate('/concerts', { replace: true });
    }, [state, navigate]);

    if (!state?.concert) return null;

    if (status.done) {
        return (
            <div className="concert-container">
                <header className="concert-header">
                    <h1>Payment successful</h1>
                </header>
                <section className="concert-main" style={{ textAlign: 'center', gap: '1.5rem' }}>
                    <div style={{
                        width: '4rem', height: '4rem', margin: '0 auto',
                        display: 'grid', placeItems: 'center', fontSize: '1.8rem',
                        borderRadius: '999px', background: 'var(--success)',
                        color: 'var(--abyss)',
                        boxShadow: '0 0 0 8px rgba(47,212,167,0.15)',
                    }}>✓</div>
                    <div>
                        <p style={{ color: 'var(--text)', fontSize: '1.1rem', margin: '0 0 0.4rem' }}>
                            You're going to <strong>{concert.title}</strong>.
                        </p>
                        <p style={{ color: 'var(--text-soft)', margin: 0 }}>
                            {quantity} × {seatType} · {eur.format(totalWithVAT)}
                        </p>
                        <p style={{ color: 'var(--text-faint)', fontSize: '0.82rem', margin: '0.5rem 0 0' }}>
                            Transaction: {status.done.transactionId} · Card ending {status.done.cardLastFour}
                        </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'center' }}>
                        {status.done.tickets?.map(t => (
                            <span key={t.id} style={{
                                color: 'var(--foam)', fontSize: '0.85rem',
                                fontFamily: 'var(--font-display)', letterSpacing: '0.05em',
                            }}>
                                Seat {t.seatIdentifier}
                            </span>
                        ))}
                    </div>
                    <button type="button" className="book-button" onClick={() => navigate('/concerts')}>
                        Back to concerts
                    </button>
                </section>
            </div>
        );
    }

    return (
        <div className="concert-container">
            <header className="concert-header">
                <h1>Complete your purchase</h1>
                <button type="button" className="badge" style={{ cursor: 'pointer' }}
                        onClick={() => navigate(-1)}>
                    ← Back
                </button>
            </header>

            <section className="concert-main" style={{ gap: '1.5rem' }}>

                {/* Order summary */}
                <div className="info-card">
                    <h3>Order summary</h3>
                    <p><strong>Concert:</strong> {concert.title}</p>
                    <p><strong>Date:</strong> {concert.startingDay} · Doors {concert.startingHour}</p>
                    <p><strong>Venue:</strong> {concert.location?.name}</p>
                    <p><strong>Tier:</strong> {seatType}</p>
                    <p><strong>Quantity:</strong> {quantity}</p>
                    <div style={{
                        marginTop: '0.9rem', paddingTop: '0.9rem',
                        borderTop: '1px solid rgba(78,166,255,0.14)',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                    }}>
                        <span style={{ color: 'var(--text-soft)' }}>Total (incl. 9% VAT)</span>
                        <strong style={{
                            fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#fff',
                        }}>
                            {eur.format(totalWithVAT)}
                        </strong>
                    </div>
                </div>

                {/* Card form */}
                <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {status.error && (
                        <div style={{
                            padding: '0.7rem 0.9rem', borderRadius: 'var(--radius-sm)',
                            background: 'rgba(255,93,108,0.1)',
                            border: '1px solid rgba(255,93,108,0.4)',
                            color: 'var(--danger)', fontSize: '0.9rem',
                        }}>
                            {status.error}
                        </div>
                    )}

                    <div className="input-group">
                        <label>Cardholder name</label>
                        <input
                            type="text"
                            value={form.cardHolderName}
                            onChange={e => updateField('cardHolderName', e.target.value)}
                            placeholder="Jane Doe"
                            autoComplete="cc-name"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Card number</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={form.cardNumber}
                                onChange={e => updateField('cardNumber', e.target.value)}
                                placeholder="1234 5678 9012 3456"
                                autoComplete="cc-number"
                                style={{ paddingRight: cardType ? '4rem' : undefined }}
                                required
                            />
                            <CardBadge type={cardType} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div className="input-group" style={{ flex: 1 }}>
                            <label>Expiry date</label>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={form.expiryDate}
                                onChange={e => updateField('expiryDate', e.target.value)}
                                placeholder="MM/YY"
                                autoComplete="cc-exp"
                                maxLength={5}
                                required
                            />
                        </div>
                        <div className="input-group" style={{ flex: 1 }}>
                            <label>CVV</label>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={form.cvv}
                                onChange={e => updateField('cvv', e.target.value)}
                                placeholder={cardType === 'amex' ? '4 digits' : '3 digits'}
                                autoComplete="cc-csc"
                                maxLength={cardType === 'amex' ? 4 : 3}
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="book-button"
                        disabled={status.loading}
                        style={{ marginTop: '0.5rem' }}
                    >
                        {status.loading ? 'Processing…' : `Pay ${eur.format(totalWithVAT)}`}
                    </button>
                </form>
            </section>
        </div>
    );
};

export default PaymentPage;