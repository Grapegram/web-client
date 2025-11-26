<script setup lang="ts">
import { cn } from '@grapegram/ui-kit';
import { Input } from '@grapegram/ui-kit';
import { Field, FieldError, FieldLabel } from '@grapegram/ui-kit';

interface Props {
  id: string;
  label: string;
  placeholder: string;
  error?: string;
  modelValue?: string;
}

withDefaults(defineProps<Props>(), {
  label: 'Default label',
  placeholder: 'default placeholder'
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>

<template>
  <Field :invalid="!!error">
    <FieldLabel :for="id">{{ label }}</FieldLabel>
    <Input
      :id="id"
      :placeholder="placeholder"
      :invalid="!!error"
      :class="cn({ 'border-destructive': error })"
      :model-value="modelValue"
      @update:model-value="value => emit('update:modelValue', String(value))"
      v-bind="$attrs"
    />
    <FieldError v-if="error">{{ error }}</FieldError>
  </Field>
</template>
