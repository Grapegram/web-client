<script setup lang="ts">
import { cn } from '@/shared/lib/utils';
import {
  PinInputInput,
  type PinInputInputProps,
  useForwardProps
} from 'reka-ui';
import { computed, type HTMLAttributes } from 'vue';

const props = defineProps<
  PinInputInputProps & { class?: HTMLAttributes['class'] }
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <PinInputInput
    v-bind="forwardedProps"
    :class="
      cn(
        'focus:ring-ring border-input relative flex h-9 w-9 items-center justify-center border-y border-r text-center text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md focus:relative focus:z-10 focus:ring-2 focus:outline-hidden',
        props.class
      )
    "
  />
</template>
