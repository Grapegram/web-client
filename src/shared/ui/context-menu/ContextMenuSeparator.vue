<script setup lang="ts">
import { cn } from '@/shared/lib/utils';
import { ContextMenuSeparator, type ContextMenuSeparatorProps } from 'reka-ui';
import { computed, type HTMLAttributes } from 'vue';

const props = defineProps<
  ContextMenuSeparatorProps & { class?: HTMLAttributes['class'] }
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <ContextMenuSeparator
    v-bind="delegatedProps"
    :class="cn('bg-border -mx-1 my-1 h-px', props.class)"
  />
</template>
