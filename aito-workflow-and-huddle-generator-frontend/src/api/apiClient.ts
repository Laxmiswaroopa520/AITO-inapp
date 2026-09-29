export class ApiError extends Error {
  public readonly status: number;
  public readonly details: unknown;

  public constructor(message: string, status: number, details: unknown = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export interface ApiClient {
  get<TResponse>(path: string, signal?: AbortSignal): Promise<TResponse>;
  post<TResponse, TRequest>(path: string, body: TRequest, signal?: AbortSignal): Promise<TResponse>;
  put<TResponse, TRequest>(path: string, body: TRequest, signal?: AbortSignal): Promise<TResponse>;
  patch<TResponse, TRequest>(path: string, body: TRequest, signal?: AbortSignal): Promise<TResponse>;
  delete(path: string, signal?: AbortSignal): Promise<void>;
}
