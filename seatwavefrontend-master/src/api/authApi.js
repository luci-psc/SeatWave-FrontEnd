import { request } from './client';
export function login(credentials)  { return request('/api/auth/login',    { method: 'POST', body: JSON.stringify(credentials) }); }
export function register(account)   { return request('/api/auth/register', { method: 'POST', body: JSON.stringify(account) }); }