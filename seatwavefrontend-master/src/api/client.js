// Read the backend base URL from the Vite env var so it can be overridden per
// environment (local dev, CI, production). Falls back to localhost for local use.
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

function readCookie(name) {
    const match = document.cookie.split('; ').find(row => row.startsWith(name + '='));
    return match ? match.substring(name.length + 1) : undefined;
}

export async function request(path, options = {}) {
    const csrf = readCookie('XSRF-TOKEN');
    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...(csrf ? { 'X-XSRF-TOKEN': decodeURIComponent(csrf) } : {}),
            ...options.headers,
        },
    });
    if (!res.ok) {
        const body = await res.json().catch(() => null);
        const message =
            body?.details && Object.keys(body.details).length > 0
                ? Object.values(body.details).join(', ')
                : body?.message || body?.error || `Request failed: ${res.status}`;
        throw new Error(message);
    }

    if (res.status === 204) return null;

    const hasBody = res.headers.get('content-length') !== '0';
    return hasBody ? res.json().catch(() => null) : null;
}