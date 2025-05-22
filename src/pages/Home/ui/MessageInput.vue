<script setup lang="ts">
import { Textarea } from '@/shared/ui/textarea';
import { cn } from '@/shared/lib/utils';
import type { HTMLAttributes } from 'vue';
import { useVModel } from '@vueuse/core';

const props = defineProps<{
  class?: HTMLAttributes['class'];
  defaultValue?: string | number;
  modelValue?: string | number;
}>();

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void;
}>();

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue
});
</script>

<template>
  <Textarea
    v-model="modelValue"
    :rows="1"
    :class="cn('resize-none border-0 p-2 text-base ring-0!', props.class)"
    placeholder="Type your message..."
  />
</template>
