import { ApiError } from "@/lib/api/types";

export function normalizeHeaders(input?: HeadersInit): Headers {
  const headers = new Headers(input ?? {});
  if (!headers.has("Accept")) headers.set("Accept", "application/json");
  return headers;
}

export function normalizeBody(headers: Headers, body: unknown): BodyInit | undefined {
  if (body === undefined || body === null) return undefined;
  if (body instanceof FormData) return body;
  if (
    typeof body === "string" ||
    body instanceof Blob ||
    body instanceof ArrayBuffer ||
    ArrayBuffer.isView(body) ||
    body instanceof URLSearchParams ||
    body instanceof ReadableStream
  ) {
    return body as BodyInit;
  }

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return JSON.stringify(body);
}

export async function parseResponse(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
}

export async function unwrapOrThrow<T>(response: Response): Promise<T> {
  const payload = await parseResponse(response);

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload && "message" in payload
        ? String((payload as { message?: string }).message ?? "Request failed")
        : `Request failed with status ${response.status}`;

    throw new ApiError(message, response.status, payload);
  }

  return payload as T;
}
