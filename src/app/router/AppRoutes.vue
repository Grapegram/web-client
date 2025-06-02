<script setup lang="ts">
import { useAuthStore } from '@features/base/model/user';
import { ROUTES } from '@/shared/lib/routes';
import { computed } from 'vue';
import { RouterView } from 'vue-router';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();
const isAuth = computed(() => authStore.isAuthenticated);

router.beforeEach((to, _, next) => {
  if (to.meta.requiresAuth && !isAuth.value) {
    next(ROUTES.LOGIN);
  } else {
    next();
  }
});
</script>

<template>
  <RouterView />
</template>
