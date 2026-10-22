// src/components/concerts/PurchaseModal.jsx
import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import '../../styles/PurchaseModal.css';
import { useNavigate } from 'react-router-dom';

const eur = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' });
const MAX_PER_ORDER = 4;
const LOW_STOCK = 5;

function buildTiers(tickets) {
    return Object.values(
        (tickets ?? []).reduce((acc, t) => {
            const key = t.seatType || 'General';
            if (!acc[key]) acc[key] = { seatType: key, price: t.price, total: 0, available: 0 };
            acc[key].total += 1;
            if (t.ownerId == null) acc[key].available += 1;
            return acc;
        }, {})
    );
}

const PurchaseModal = ({ concert, isLoggedIn, onClose }) => {
    const tiers = useMemo(() => buildTiers(concert.tickets), [concert.tickets]);
    const navigate = useNavigate();

    const firstAvailable = tiers.find(t => t.available > 0) ?? tiers[0] ?? null;
    const [selectedType, setSelectedType] = useState(firstAvailable?.seatType ?? '');
    const [quantity, setQuantity] = useState(1);

    const selectedTier = tiers.find(t => t.seatType === selectedType) ?? null;
    const cap = Math.min(MAX_PER_ORDER, selectedTier?.available ?? 0);
    const safeQuantity = Math.min(Math.max(1, quantity), Math.max(1, cap));

    const unitPrice = selectedTier?.price ?? 0;
    const subtotal = unitPrice * safeQuantity;

    const canBuy = isLoggedIn && selectedTier && cap > 0;

    // Close on Escape
    useEffect(() => {
        const onKey = (e) => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    const handleBuy = (e) => {
        e?.preventDefault();
        if (!canBuy) return;
        onClose();
        navigate('/payment', {
            state: {
                concert,
                quantity: safeQuantity,
                seatType: selectedType,
                unitPrice: selectedTier.price,
            },
        });
    };

    const modal = (
        <div className="pm-overlay" onClick={onClose} role="presentation">
            <div
                className="pm-dialog"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="pm-title"
            >
                <button type="button" className="pm-close" onClick={onClose} aria-label="Close">×</button>

                <header className="pm-head">
                    <span className="pm-eyebrow">Book tickets</span>
                    <h2 id="pm-title">{concert.title}</h2>
                    <p className="pm-sub">{concert.startingDay} · Doors {concert.startingHour}</p>
                </header>

                <div className="pm-section">
                    <span className="pm-label">Choose a tier</span>
                    <div className="pm-tiers">
                        {tiers.map(tier => {
                            const soldOut = tier.available === 0;
                            const low = tier.available > 0 && tier.available < LOW_STOCK;
                            const active = tier.seatType === selectedType;
                            return (
                                <button
                                    key={tier.seatType}
                                    type="button"
                                    className={`pm-tier${active ? ' is-active' : ''}${soldOut ? ' is-sold' : ''}`}
                                    disabled={soldOut}
                                    onClick={() => setSelectedType(tier.seatType)}
                                >
                                    <span className="pm-tier-info">
                                        <span className="pm-tier-name">{tier.seatType}</span>
                                        <span className={`pm-tier-left${low ? ' is-low' : ''}`}>
                                            {soldOut ? 'Sold out' : `${tier.available} of ${tier.total} left`}
                                        </span>
                                    </span>
                                    <strong className="pm-tier-price">{eur.format(Number(tier.price))}</strong>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="pm-section pm-qty-row">
                    <span className="pm-label">Quantity</span>
                    <div className="pm-stepper" role="group" aria-label="Quantity">
                        <button
                            type="button"
                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                            disabled={safeQuantity <= 1}
                            aria-label="Decrease quantity"
                        >−</button>
                        <span className="pm-qty-value" aria-live="polite">{safeQuantity}</span>
                        <button
                            type="button"
                            onClick={() => setQuantity(q => Math.min(cap, q + 1))}
                            disabled={safeQuantity >= cap}
                            aria-label="Increase quantity"
                        >+</button>
                    </div>
                    <span className="pm-qty-hint">Up to {MAX_PER_ORDER} per order</span>
                </div>

                <div className="pm-total">
                    <span>{safeQuantity} × {eur.format(Number(unitPrice))}</span>
                    <strong>{eur.format(Number(subtotal))}</strong>
                </div>

                {!isLoggedIn && (
                    <p className="pm-notice">Log in to book tickets for this concert.</p>
                )}

                <button
                    type="button"
                    className="book-button pm-buy"
                    onClick={handleBuy}
                    disabled={!canBuy}
                >
                    {`Continue to payment · ${eur.format(Number(subtotal))}`}
                </button>
            </div>
        </div>
    );

    return createPortal(modal, document.body);
};

export default PurchaseModal;