export interface ApiError {
  message?: string | null;
  detail?: string | string[] | Record<string, unknown> | null;
  error?: string | null;
  errors?: Record<string, unknown> | string[] | null;
  [key: string]: unknown;
}