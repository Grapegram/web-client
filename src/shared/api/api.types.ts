export interface ApiError {
  status_code: number;
  detail: string;
  extra?: Record<string, unknown>;
}
