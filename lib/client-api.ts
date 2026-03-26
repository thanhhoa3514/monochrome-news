"use client";

import { API_PROXY_PREFIX } from "@/lib/api/config";
import { normalizeBody, normalizeHeaders, unwrapOrThrow } from "@/lib/api/shared";
import type { ApiClient, ApiClientRequestOptions } from "@/lib/api/types";

export const clientApiClient: ApiClient = {
  async request<T>(path: string, options: ApiClientRequestOptions = {}): Promise<T> {
    const requestHeaders = normalizeHeaders(options.headers);
    const body = normalizeBody(requestHeaders, options.body);

    const response = await fetch(`${API_PROXY_PREFIX}${path}`, {
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
