// src/auth/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { request } from '../api/client';
import * as authApi from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        request('/api/auth/me')
            .then(setUser)
            .catch(() => setUser(null))
            .finally(() => setChecked(true));
    }, []);

    const handleLogin = async (credentials) => {
        await authApi.login(credentials);          // backend sets the httpOnly cookie
        setUser(await request('/api/auth/me'));    // confirm session + get user
    };
    const handleRegister = async (account) => {
        await authApi.register(account);
        setUser(await request('/api/auth/me'));
    };
    const logout = async () => {
        await request('/api/auth/logout', { method: 'POST' });
        setUser(null);
    };

    const isAdmin = user?.role === 'ADMIN';
    return (
        <AuthContext.Provider value={{ user, isLoggedIn: !!user, isAdmin, checked, handleLogin, handleRegister, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    return useContext(AuthContext);
}