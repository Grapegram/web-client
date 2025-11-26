<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

import { useVModel } from '@vueuse/core';

import { cn } from '@/shared/lib/utils';

const props = defineProps<{
  defaultValue?: string | number;
  modelValue?: string | number;
  class?: HTMLAttributes['class'];
  invalid?: boolean;
  disabled?: boolean;
  placeholder?: string;
  type?: string;
}>();

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void;
}>();

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue
});

defineOptions({
  name: 'BaseInput'
});
</script>

<template>
  <input
    v-model="modelValue"
    data-slot="input"
    :type="props.type || 'text'"
    :aria-invalid="props.invalid"
    :disabled="props.disabled"
    :placeholder="props.placeholder"
    :class="
      cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-sm transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-accent focus-visible:ring-ring-accent/25 focus-visible:ring-2',
        'aria-invalid:ring-ring-destructive/25 dark:aria-invalid:ring-ring-destructive/40 aria-invalid:border-destructive aria-invalid:text-destructive',
        props.class
      )
    "
  />
</template>
