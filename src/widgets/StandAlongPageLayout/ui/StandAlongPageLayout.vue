<script setup lang="ts">
import { computed } from 'vue';

import { useRoute } from 'vue-router';

import { Button } from '@grapegram/ui-kit';

import { world } from '@/shared/assets';
import { ROUTES } from '@/shared/lib/routes';
import { Logo } from '@/shared/ui/logo';

const route = useRoute();

const isLoginPage = computed(() => route.path === ROUTES.LOGIN);
const buttonLabel = computed(() => (isLoginPage.value ? 'Sign up' : 'Log in'));
const buttonTo = computed(() =>
  isLoginPage.value ? ROUTES.SIGNUP : ROUTES.LOGIN
);
</script>

<template>
  <div class="h-dvh max-h-dvh w-full overflow-hidden">
    <header class="top-0 flex w-full flex-row items-center gap-2 px-12 py-5">
      <Logo with-text class="flex-1" />

      <RouterLink :to="buttonTo" class="basis-1/6">
        <Button variant="outline" class="w-full">
          {{ buttonLabel }}
        </Button>
      </RouterLink>
    </header>
    <slot />
    <img
      class="fixed right-2/4 bottom-0 translate-x-[50%] translate-y-[80%] opacity-75 md:visible md:right-0 md:translate-x-[48%] md:translate-y-[65%]"
      :src="world"
    />
  </div>
</template>
