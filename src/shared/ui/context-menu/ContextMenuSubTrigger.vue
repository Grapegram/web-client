<script setup lang="ts">
import { cn } from '@/shared/lib/utils';
import { ChevronRight } from 'lucide-vue-next';
import {
  ContextMenuSubTrigger,
  type ContextMenuSubTriggerProps,
  useForwardProps
} from 'reka-ui';
import { computed, type HTMLAttributes } from 'vue';

const props = defineProps<
  ContextMenuSubTriggerProps & {
    class?: HTMLAttributes['class'];
    inset?: boolean;
  }
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <ContextMenuSubTrigger
    v-bind="forwardedProps"
    :class="
      cn(
        'focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none',
        inset && 'pl-8',
        props.class
      )
    "
  >
    <slot />
    <ChevronRight class="ml-auto h-4 w-4" />
  </ContextMenuSubTrigger>
</template>
