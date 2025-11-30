<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useRouter } from 'vue-router';

import 'vue-sonner/style.css';

import { useUserStore } from '@/entities/user';
import { ROUTES } from '@/shared/lib/routes';
import { Toaster } from '@/shared/ui/sonner';

const router = useRouter();
const userStore = useUserStore();

router.beforeEach((to, _, next) => {
  const isAuthPage = to.path === ROUTES.LOGIN || to.path === ROUTES.SIGNUP;

  if (userStore.isAuthorized && isAuthPage) {
    next(ROUTES.HOME);
    return;
  }

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!userStore.isAuthorized) {
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
