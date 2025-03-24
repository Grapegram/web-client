<script setup lang="ts">
import { logo } from '@/shared/assets';
import { Avatar, AvatarImage } from '@/shared/ui/avatar';

interface FormLayoutProps {
  title: string;
  subtitle: string;
}

const props = defineProps<FormLayoutProps>();
</script>

<template>
  <section
    class="flex w-full max-w-xs flex-col items-center justify-center gap-y-11"
  >
    <Avatar
      class="hover:drop-shadow-accent h-[120px] w-[120px] bg-transparent transition-all duration-300"
    >
      <AvatarImage class="object-fill" :src="logo" />
    </Avatar>

    <div class="flex flex-col items-center justify-center gap-y-1.5">
      <h1 class="text-center text-2xl font-bold">{{ props.title }}</h1>
      <p class="text-center font-thin opacity-50">{{ props.subtitle }}</p>
    </div>
    <slot />
  </section>
</template>
