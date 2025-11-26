import { isAxiosError } from 'axios';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { ApiError } from '../api';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toApiError(error: unknown): ApiError {
  if (isAxiosError(error) && error.response) {
    return error.response.data as ApiError;
  }

  return {
    status_code: 500,
    detail: 'Unknown error',
    extra: {}
  };
}
