import { jwtDecode } from 'jwt-decode';

export interface DecodedToken {
  user_id: string;
  email: string;
  username: string;
  is_verified: boolean;
  is_active: boolean;
  type: 'access_token';
  exp: number;
  iat: number;
  nbf: number;
}

export function decodeToken(token: string): DecodedToken {
  return jwtDecode<DecodedToken>(token);
}

export function isTokenExpired(exp?: number): boolean {
  if (!exp) return true;
  return Math.floor(Date.now() / 1000) >= exp;
}
