export const ROUTES = {
  HOME: '/home',
  LOGIN: '/login',
  SIGNUP: '/signup',
  NOT_FOUND: '/:pathMatch(.*)*'
} as const;

export type RoutePaths = (typeof ROUTES)[keyof typeof ROUTES];
