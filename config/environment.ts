// Debug: log environment variable
const envApiUrl = process.env.API_URL || process.env.VITE_API_URL;

// Fallback to production URL if env var is not set
export const API_URL = envApiUrl || 'https://backend-php-news-app.onrender.com';
export const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || process.env.VITE_STRIPE_PUBLISHABLE_KEY;