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

export interface VerifyEmailRequest {
  token: string;
}
