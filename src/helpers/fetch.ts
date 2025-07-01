import { store } from "../app/store";
import { logout } from "../reducers/authSlice";

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
const baseUrl = import.meta.env.VITE_API_URL;
export const fetchSinToken = async (endpoint: string, data?: any, method: HttpMethod = 'GET') => {
    const url = `${baseUrl}/${endpoint}`;
    const response = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: method !== 'GET' && data ? JSON.stringify(data) : undefined,
        credentials: 'include', // Include cookies in the request
    });

    const result = await response.json();
    if (response.status === 401) {
        store.dispatch(logout());
    }

    return result;
}