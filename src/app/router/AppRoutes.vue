<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue';

import { RouterView } from 'vue-router';
import { useRouter } from 'vue-router';

import { toast } from 'vue-sonner';
import 'vue-sonner/style.css';

import { useAuthStore } from '@/features/auth';
import { ROUTES } from '@/shared/lib/routes';
import { Toaster } from '@/shared/ui/sonner';

const router = useRouter();
const authStore = useAuthStore();

function handleUnauthorized() {
  authStore.logout();
  toast.error('Session expired', {
    description: 'Please log in again'
  });
  router.push({
    path: ROUTES.LOGIN,
    query: { expired: 'true' }
  });
}

onMounted(() => {
  window.addEventListener('auth:unauthorized', handleUnauthorized);
});

onBeforeUnmount(() => {
  window.removeEventListener('auth:unauthorized', handleUnauthorized);
});

router.beforeEach((to, _, next) => {
  const isAuthPage = to.path === ROUTES.LOGIN || to.path === ROUTES.SIGNUP;

  const tokenExpired = authStore.checkTokenExpiration();

  if (tokenExpired && !isAuthPage) {
    next({
      path: ROUTES.LOGIN,
      query: { redirect: to.fullPath, expired: 'true' }
    });
    return;
  }

  if (authStore.isAuthorized && isAuthPage) {
    next(ROUTES.HOME);
    return;
  }

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!authStore.isAuthorized) {
      next({
        path: ROUTES.LOGIN,
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else {
    next();
  }
});
</script>

<template>
  <RouterView />
  <Toaster position="bottom-left" />
</template>
