<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

import { DialogTrigger } from 'reka-ui';

const props = defineProps<{
  class?: HTMLAttributes['class'];
  asChild?: boolean;
}>();
</script>

<template>
  <DialogTrigger :as-child="asChild" :class="props.class">
    <slot />
  </DialogTrigger>
</template>
