// Debug: log environment variable
const envApiUrl = import.meta.env.VITE_API_URL;
console.log('[Environment] VITE_API_URL:', envApiUrl);

// Fallback to production URL if env var is not set
export const API_URL = envApiUrl || 'https://backend-php-news-app.onrender.com';
export const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

console.log('[Environment] Using API_URL:', API_URL);