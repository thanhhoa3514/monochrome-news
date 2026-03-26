import "server-only";

import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, toApiUrl } from "@/lib/api/config";
import { normalizeBody, normalizeHeaders, unwrapOrThrow } from "@/lib/api/shared";
import type { ApiClient, ApiClientRequestOptions } from "@/lib/api/types";

function createServerApiClient(includeAuth: boolean): ApiClient {
  return {
    async request<T>(path: string, options: ApiClientRequestOptions = {}): Promise<T> {
      const requestHeaders = normalizeHeaders(options.headers);

      if (includeAuth && !requestHeaders.has("Authorization")) {
        const authToken = cookies().get(AUTH_COOKIE_NAME)?.value;
        if (authToken) {
          requestHeaders.set("Authorization", `Bearer ${authToken}`);
        }
      }

      const body = normalizeBody(requestHeaders, options.body);

      const response = await fetch(toApiUrl(path), {
        method: options.method ?? "GET",
        headers: requestHeaders,
        body,
        credentials: options.credentials ?? "include",
        ...(options.next?.revalidate !== undefined
          ? { next: options.next }
          : { cache: options.cache ?? "no-store", next: options.next }),
      });

      return unwrapOrThrow<T>(response);
    },
  };
}

export const publicServerApiClient: ApiClient = createServerApiClient(false);
export const authenticatedServerApiClient: ApiClient = createServerApiClient(true);

// Backward-compatible alias for authenticated server-side operations.
export const serverApiClient: ApiClient = authenticatedServerApiClient;
