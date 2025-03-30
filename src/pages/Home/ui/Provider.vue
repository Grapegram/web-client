<script setup lang="ts">
import { provide } from 'vue';

const props = defineProps<{
  name: string;
  data: unknown;
}>();

provide(props.name, props.data);
</script>

<template>
  <slot />
</template>
