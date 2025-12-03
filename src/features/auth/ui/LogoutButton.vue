<script setup lang="ts">
import { useRouter } from 'vue-router';

import { LogOut } from 'lucide-vue-next';

import { Button } from '@grapegram/ui-kit';

import { ROUTES } from '@/shared/lib/routes';

import { useAuthStore } from '../model';

const authStore = useAuthStore();
const router = useRouter();

function handleLogout() {
  authStore.logout();
  router.push(ROUTES.LOGIN);
}
</script>

<template>
  <Button variant="ghost" size="icon" @click="handleLogout">
    <LogOut />
  </Button>
</template>
