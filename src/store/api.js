export const PRODUCT_API = 'http://localhost:8001/api/v1';
export const ORDER_API = 'http://localhost:8002/api/v1';
export const USER_API = 'http://localhost:8003/api/v1';

const getToken = () => localStorage.getItem('token');


export async function apiFetch(baseUrl, path, options = {}) {
    const token = getToken();

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
    };

    const response = await fetch(`${baseUrl}${path}`, {
        ...options,
        headers,
    });

    if (response.status === 204) return null;

    const data = await response.json();

    if (!response.ok) {
        const message =
            data?.detail?.[0]?.msg || data?.detail || `HTTP ${response.status}`;
        throw new Error(message);
    }

    return data;
}