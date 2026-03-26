const FALLBACK_API_URL = "https://backend-php-news-app.onrender.com";
const FALLBACK_SITE_URL = "http://localhost:3000";

function readEnvUrl(...values: Array<string | undefined>): string | undefined {
  for (const value of values) {
    const normalized = value?.trim();

    if (!normalized) {
      continue;
    }

    if (normalized === "undefined" || normalized === "null") {
      continue;
    }

    return normalized;
  }

  return undefined;
}

function normalizeAbsoluteUrl(value: string | undefined, fallback: string): string {
  try {
    return new URL(value ?? fallback).toString().replace(/\/$/, "");
  } catch {
    return fallback;
  }
}

export const API_URL = normalizeAbsoluteUrl(
  readEnvUrl(process.env.NEXT_PUBLIC_API_URL, process.env.VITE_API_URL),
  FALLBACK_API_URL,
);

export const SITE_URL = normalizeAbsoluteUrl(
  readEnvUrl(process.env.NEXT_PUBLIC_SITE_URL),
  FALLBACK_SITE_URL,
);

export const STRIPE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || process.env.VITE_STRIPE_PUBLISHABLE_KEY;
