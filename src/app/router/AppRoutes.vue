<script setup lang="ts">
import { ROUTES } from '@/shared/lib/routes';
import { RouterView } from 'vue-router';
import { useRouter } from 'vue-router';

const router = useRouter();
const isAuth = true; // TODO: implement auth

router.beforeEach((to, _, next) => {
  if (to.meta.requiresAuth && !isAuth) {
    next(ROUTES.LOGIN);
  } else {
    next();
  }
});
</script>

<template>
  <RouterView />
</template>
