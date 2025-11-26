<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

import { DialogDescription } from 'reka-ui';

import { cn } from '@/shared/lib/utils';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();
</script>

<template>
  <DialogDescription :class="cn('text-muted-foreground text-sm', props.class)">
    <slot />
  </DialogDescription>
</template>
