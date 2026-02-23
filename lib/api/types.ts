export interface ApiClientRequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
}

export interface ApiClient {
  request<T>(path: string, options?: ApiClientRequestOptions): Promise<T>;
}

export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}
