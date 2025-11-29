import $api from '@/shared/api';
import { toApiError } from '@/shared/lib/utils';

import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  VerifyEmailRequest
} from '../model/auth.types';

const API_PREFIX = '/auth';

async function login(dto: LoginRequest) {
  try {
    const { data } = await $api.post<LoginResponse>(`${API_PREFIX}/login`, dto);
    return data;
  } catch (error) {
    throw toApiError(error);
  }
}

async function register(dto: RegisterRequest) {
  try {
    const data = await $api.post(`${API_PREFIX}/register`, dto);
    return data;
  } catch (error) {
    throw toApiError(error);
  }
}

async function verifyEmail(dto: VerifyEmailRequest) {
  try {
    await $api.post(`${API_PREFIX}/verify-email`, dto);
  } catch (error) {
    throw toApiError(error);
  }
}

export const AuthApi = {
  login,
  register,
  verifyEmail
};
