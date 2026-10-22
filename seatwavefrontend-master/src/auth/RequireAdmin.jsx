// src/auth/RequireAdmin.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function RequireAdmin({ children }) {
    const { isAdmin, checked } = useAuth();
    if (!checked) return <div>Loading…</div>;     // wait for /me to resolve
    return isAdmin ? children : <Navigate to="/concerts" replace />;
}