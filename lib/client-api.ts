"use client";

import { toApiUrl } from "@/lib/api/config";
import { normalizeBody, normalizeHeaders, unwrapOrThrow } from "@/lib/api/shared";
import type { ApiClient, ApiClientRequestOptions } from "@/lib/api/types";

export const clientApiClient: ApiClient = {
  async request<T>(path: string, options: ApiClientRequestOptions = {}): Promise<T> {
    const requestHeaders = normalizeHeaders(options.headers);

    // Auto-attach auth token from localStorage
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token && !requestHeaders.has("Authorization")) {
        requestHeaders.set("Authorization", `Bearer ${token}`);
      }
    }

    const body = normalizeBody(requestHeaders, options.body);

    const response = await fetch(toApiUrl(path), {
      method: options.method ?? "GET",
      headers: requestHeaders,
      body,
      credentials: options.credentials ?? "include",
      cache: options.cache ?? "no-store",
      next: options.next,
    });

    return unwrapOrThrow<T>(response);
  },
};
