<script setup lang="ts">
import { logo, world } from '@/shared/assets';
import { ROUTES } from '@/shared/lib/routes';
import { Avatar, AvatarImage } from '@/shared/ui/avatar';
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="h-dvh max-h-dvh w-full overflow-hidden">
    <header class="top-0 flex w-full flex-row items-center gap-2 px-12 py-5">
      <RouterLink
        :to="ROUTES.DEFAULT"
        class="flex flex-row items-center justify-center gap-2"
      >
        <Avatar
          class="hover:drop-shadow-accent h-[50px] w-[50px] bg-transparent transition-all duration-300"
        >
          <AvatarImage class="object-fill" :src="logo" />
        </Avatar>
        <h5 class="text-h5">Grapegram</h5>
      </RouterLink>
    </header>
    <slot />
    <img
      class="fixed right-2/4 bottom-0 translate-x-[50%] translate-y-[80%] opacity-75 md:visible md:right-0 md:translate-x-[48%] md:translate-y-[65%]"
      :src="world"
    />
  </div>
</template>
