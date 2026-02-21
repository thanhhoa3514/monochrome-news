/**
 * Helper function to get authentication headers
 * Returns Authorization header if token exists in localStorage
 */
export function getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('auth_token');
    const headers: Record<string, string> = {
        'Accept': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
}

/**
 * Helper function to get authentication headers with Content-Type for JSON
 */
export function getAuthHeadersWithJson(): Record<string, string> {
    return {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
    };
}
