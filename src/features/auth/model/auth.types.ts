export interface LoginRequest {
  credential: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
  username: string;
  isVerified: boolean;
}

export interface VerifyEmailRequest {
  token: string;
}
