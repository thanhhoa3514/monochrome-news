export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://backend-php-news-app.onrender.com";

export const API_PREFIX = "/api/v1";
export const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME ?? "auth_token";

export function toApiUrl(path: string): string {
  return `${API_BASE_URL}${API_PREFIX}${path}`;
}
