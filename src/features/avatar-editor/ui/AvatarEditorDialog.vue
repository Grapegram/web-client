<script setup lang="ts">
import { computed } from 'vue';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/shared/ui/dialog';

import type { CroppedImageResult } from '../model/avatar-editor.types';
import AvatarEditor from './AvatarEditor.vue';

interface Props {
  open?: boolean;
  title?: string;
  description?: string;
  containerSize?: number;
  maxFileSize?: number;
  outputSize?: number;
  outputQuality?: number;
  initialFile?: File | null;
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  title: 'Edit Avatar',
  description: 'Upload and crop your avatar image',
  containerSize: 400,
  maxFileSize: 10 * 1024 * 1024,
  outputSize: 512,
  outputQuality: 0.92,
  initialFile: null
});

const emit = defineEmits<{
  'update:open': [value: boolean];
  save: [result: CroppedImageResult];
  cancel: [];
}>();

const isOpen = computed({
  get: () => props.open,
  set: (value: boolean) => emit('update:open', value)
});

function handleImageCropped(result: CroppedImageResult): void {
  emit('save', result);
  isOpen.value = false;
}

function handleCancel(): void {
  emit('cancel');
  isOpen.value = false;
}

function handleError(_error: string): void {
  // Error is already displayed in the AvatarEditor component
}
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="max-w-2xl">
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription>{{ description }}</DialogDescription>
      </DialogHeader>

      <AvatarEditor
        :container-size="containerSize"
        :max-file-size="maxFileSize"
        :output-size="outputSize"
        :output-quality="outputQuality"
        :initial-file="initialFile"
        @image-cropped="handleImageCropped"
        @cancel="handleCancel"
        @error="handleError"
      />
    </DialogContent>
  </Dialog>
</template>
