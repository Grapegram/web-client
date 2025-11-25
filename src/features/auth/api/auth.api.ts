import $api from '@/shared/api';

import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  VerifyEmailRequest
} from '../model/auth.types';

const API_PREFIX = '/auth';

async function login(dto: LoginRequest) {
  const { data } = await $api.post<LoginResponse>(`${API_PREFIX}/login`, dto);
  return data;
}

async function register(dto: RegisterRequest) {
  await $api.post(`${API_PREFIX}/register`, dto);
}

async function verifyEmail(dto: VerifyEmailRequest) {
  await $api.post(`${API_PREFIX}/verify-email`, dto);
}

export const AuthApi = {
  login,
  register,
  verifyEmail
};
