<script setup lang="ts">
import { useRouter } from 'vue-router';

import { LogOut } from 'lucide-vue-next';

import { Button } from '@grapegram/ui-kit';

import { ROUTES } from '@/shared/lib/routes';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/shared/ui/tooltip';

import { useAuthStore } from '../model';

const props = defineProps<{
  class?: string;
}>();

const authStore = useAuthStore();
const router = useRouter();

function handleLogout() {
  authStore.logout();
  router.push(ROUTES.LOGIN);
}
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <Button :class="props.class" @click="handleLogout" variant="outline">
          <LogOut class="mr-2" />
          Log Out
        </Button>
      </TooltipTrigger>
      <TooltipContent>Log Out from account</TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
