<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useRouter } from 'vue-router';

import 'vue-sonner/style.css';

import { ROUTES } from '@/shared/lib/routes';
import { Toaster } from '@/shared/ui/sonner';

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
  <Toaster position="bottom-left" />
</template>
