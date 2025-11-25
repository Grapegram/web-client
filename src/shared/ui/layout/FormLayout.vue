<script setup lang="ts">
import { Typography } from '@grapegram/ui-kit';

interface FormLayoutProps {
  title: string;
  subtitle: string;
}

const props = defineProps<FormLayoutProps>();
</script>

<template>
  <section
    class="flex w-full max-w-xs flex-col items-center justify-center gap-y-10"
  >
    <div class="flex flex-col items-center justify-center gap-y-1">
      <Typography variant="h5" weight="bold">{{ props.title }}</Typography>
      <Typography class="text-muted-foreground text-center">{{
        props.subtitle
      }}</Typography>
    </div>
    <slot />
  </section>
</template>
