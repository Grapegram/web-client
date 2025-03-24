import { createRouter, createWebHistory } from 'vue-router';
import { HomePage } from '@pages/Home';
import { LoginPage } from '@pages/Login';
import { SignupPage } from '@pages/Signup';
import { ROUTES } from '@/shared/lib/routes';

const publicRoutes = [
  { path: ROUTES.SIGNUP, component: SignupPage },
  { path: ROUTES.LOGIN, component: LoginPage }
];

const privateRoutes = [
  { path: ROUTES.HOME, component: HomePage, meta: { requiresAuth: true } }
];

const routes = [
  ...publicRoutes,
  ...privateRoutes,
  { path: ROUTES.NOT_FOUND, redirect: ROUTES.LOGIN }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
