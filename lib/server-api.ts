import "server-only";

import { cookies, headers } from "next/headers";
import { AUTH_COOKIE_NAME, toApiUrl } from "@/lib/api/config";
import { normalizeBody, normalizeHeaders, unwrapOrThrow } from "@/lib/api/shared";
import type { ApiClient, ApiClientRequestOptions } from "@/lib/api/types";

export const serverApiClient: ApiClient = {
  async request<T>(path: string, options: ApiClientRequestOptions = {}): Promise<T> {
    const requestHeaders = normalizeHeaders(options.headers);
    const cookieStore = cookies();
    const incomingHeaders = headers();

    if (!requestHeaders.has("Authorization")) {
      const authToken = cookieStore.get(AUTH_COOKIE_NAME)?.value;
      if (authToken) {
        requestHeaders.set("Authorization", `Bearer ${authToken}`);
      }
    }

    const rawCookie = incomingHeaders.get("cookie");
    if (rawCookie && !requestHeaders.has("Cookie")) {
      requestHeaders.set("Cookie", rawCookie);
    }

    const body = normalizeBody(requestHeaders, options.body);

    const response = await fetch(toApiUrl(path), {
      method: options.method ?? "GET",
      headers: requestHeaders,
      body,
      credentials: options.credentials ?? "include",
      // If revalidate is specified, we must NOT set cache: 'no-store'
      ...(options.next?.revalidate !== undefined 
        ? { next: options.next } 
        : { cache: options.cache ?? "no-store", next: options.next }
      ),
    });

    return unwrapOrThrow<T>(response);
  },
};
