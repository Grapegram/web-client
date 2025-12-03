<script setup lang="ts">
import { ref, watch } from 'vue';

import { X } from 'lucide-vue-next';

import { Input } from '@/shared/ui/input';

interface Props {
  modelValue?: string;
}

interface Emits {
  (e: 'update:modelValue', value: string): void;
  (e: 'focus'): void;
  (e: 'blur'): void;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: ''
});

const emit = defineEmits<Emits>();

const searchQuery = ref(props.modelValue);
const inputRef = ref<HTMLInputElement>();

watch(
  () => props.modelValue,
  newValue => {
    searchQuery.value = newValue;
  }
);

watch(searchQuery, newValue => {
  emit('update:modelValue', newValue);
});

function handleFocus() {
  emit('focus');
}

function handleBlur() {
  emit('blur');
}

function clearSearch() {
  searchQuery.value = '';
  inputRef.value?.focus();
}

defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur()
});
</script>

<template>
  <div class="relative w-full">
    <!-- <Search
      class="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
      :size="18"
    /> -->
    <Input
      ref="inputRef"
      v-model="searchQuery"
      type="text"
      placeholder="Search users"
      class="pr-10 pl-10"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <button
      v-if="searchQuery"
      type="button"
      class="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
      @click="clearSearch"
    >
      <X :size="18" />
    </button>
  </div>
</template>
