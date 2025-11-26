<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

import { DialogTitle } from 'reka-ui';

import { cn } from '@/shared/lib/utils';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();
</script>

<template>
  <DialogTitle
    :class="
      cn('text-lg leading-none font-semibold tracking-tight', props.class)
    "
  >
    <slot />
  </DialogTitle>
</template>
