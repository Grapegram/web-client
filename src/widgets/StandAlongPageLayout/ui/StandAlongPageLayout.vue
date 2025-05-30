<script setup lang="ts">
import { logo, world } from '@/shared/assets';
import { Avatar, AvatarImage } from '@/shared/ui/avatar';
</script>

<template>
  <div class="h-dvh max-h-dvh w-full overflow-hidden">
    <header
      class="h-header top-0 flex w-full flex-row items-center gap-2 px-[50px]"
    >
      <Avatar
        class="hover:drop-shadow-accent h-[50px] w-[50px] bg-transparent transition-all duration-300"
      >
        <AvatarImage class="object-fill" :src="logo" />
      </Avatar>
      <h2><b>Grapegram</b></h2>
    </header>
    <slot />
    <img
      class="fixed right-2/4 bottom-0 translate-x-[50%] translate-y-[80%] md:visible md:right-0 md:translate-y-[70%]"
      :src="world"
    />
  </div>
</template>
