<script setup lang="ts">
import { computed, provide } from 'vue';

const props = defineProps<{
  provided: Record<string, unknown>;
}>();

for (const name in props.provided) {
  provide(
    name,
    computed(() => props.provided[name])
  );
}
</script>

<template>
  <slot />
</template>
