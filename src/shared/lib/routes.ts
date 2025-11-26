export const ROUTES = {
  HOME: '/home',
  LOGIN: '/login',
  SIGNUP: '/signup',
  VERIFY_EMAIL: '/verify-email',
  NOT_FOUND: '/:pathMatch(.*)*'
} as const;

export type RoutePaths = (typeof ROUTES)[keyof typeof ROUTES];
