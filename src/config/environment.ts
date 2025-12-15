// Debug: log environment variable
const envApiUrl = import.meta.env.VITE_API_URL;

// Fallback to production URL if env var is not set
export const API_URL = envApiUrl || 'https://backend-php-news-app.onrender.com';
export const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;