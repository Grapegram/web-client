<script setup lang="ts">
import { ref } from 'vue';

import { CameraIcon, ImageIcon } from 'lucide-vue-next';

import { AvatarEditor } from '@/features/avatar-editor';
import type { CroppedImageResult } from '@/features/avatar-editor';
import { Button } from '@/shared/ui/button';

import type { CapturedPhoto } from '../model/camera-capture.types';
import CameraCapture from './CameraCapture.vue';

interface Props {
  containerSize?: number;
  maxFileSize?: number;
  outputSize?: number;
  outputQuality?: number;
  cameraFacingMode?: 'user' | 'environment';
}

const props = withDefaults(defineProps<Props>(), {
  containerSize: 400,
  maxFileSize: 10 * 1024 * 1024,
  outputSize: 512,
  outputQuality: 0.92,
  cameraFacingMode: 'user'
});

const emit = defineEmits<{
  saved: [result: CroppedImageResult];
  cancel: [];
  error: [error: string];
}>();

type ViewMode = 'choose' | 'camera' | 'editor';

const currentView = ref<ViewMode>('choose');
const capturedFile = ref<File | null>(null);

function handleChooseCamera(): void {
  currentView.value = 'camera';
}

function handleChooseFile(): void {
  currentView.value = 'editor';
}

function handleCameraCapture(photo: CapturedPhoto): void {
  capturedFile.value = photo.file;
  currentView.value = 'editor';
}

function handleCameraError(error: string): void {
  emit('error', error);
}

function handleEditorSave(result: CroppedImageResult): void {
  emit('saved', result);
  handleReset();
}

function handleEditorCancel(): void {
  if (capturedFile.value) {
    // If came from camera, go back to camera
    capturedFile.value = null;
    currentView.value = 'camera';
  } else {
    // Otherwise go back to choose screen
    handleReset();
  }
}

function handleBackToChoose(): void {
  capturedFile.value = null;
  currentView.value = 'choose';
}

function handleReset(): void {
  capturedFile.value = null;
  currentView.value = 'choose';
  emit('cancel');
}
</script>

<template>
  <div class="flex w-full flex-col gap-6">
    <!-- Choose Mode Screen -->
    <div v-if="currentView === 'choose'" class="flex flex-col gap-4">
      <div class="flex flex-col gap-3">
        <h3 class="text-lg font-semibold">Choose photo source</h3>
        <p class="text-muted-foreground text-sm">
          Take a new photo with your camera or upload an existing image
        </p>
      </div>

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <!-- Camera Option -->
        <button
          type="button"
          class="bg-muted hover:bg-muted/80 hover:border-primary flex flex-col items-center gap-3 rounded-lg border-2 border-dashed border-transparent p-8 transition-colors"
          @click="handleChooseCamera"
        >
          <div class="bg-primary/10 text-primary rounded-full p-4">
            <CameraIcon class="size-8" />
          </div>
          <div class="text-center">
            <p class="font-medium">Take Photo</p>
            <p class="text-muted-foreground mt-1 text-xs">
              Use your camera to capture a photo
            </p>
          </div>
        </button>

        <!-- File Upload Option -->
        <button
          type="button"
          class="bg-muted hover:bg-muted/80 hover:border-primary flex flex-col items-center gap-3 rounded-lg border-2 border-dashed border-transparent p-8 transition-colors"
          @click="handleChooseFile"
        >
          <div class="bg-primary/10 text-primary rounded-full p-4">
            <ImageIcon class="size-8" />
          </div>
          <div class="text-center">
            <p class="font-medium">Upload Image</p>
            <p class="text-muted-foreground mt-1 text-xs">
              Choose an existing image from your device
            </p>
          </div>
        </button>
      </div>

      <div class="flex justify-end">
        <Button variant="outline" @click="handleReset"> Cancel </Button>
      </div>
    </div>

    <!-- Camera View -->
    <div v-else-if="currentView === 'camera'" class="flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">Take a photo</h3>
        <Button variant="ghost" size="sm" @click="handleBackToChoose">
          Back
        </Button>
      </div>

      <CameraCapture
        :auto-start="true"
        :facing-mode="props.cameraFacingMode"
        :capture-quality="props.outputQuality"
        :width="props.containerSize"
        :height="props.containerSize"
        @captured="handleCameraCapture"
        @error="handleCameraError"
      />
    </div>

    <!-- Editor View -->
    <div v-else-if="currentView === 'editor'" class="flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">Crop your photo</h3>
        <Button
          v-if="capturedFile"
          variant="ghost"
          size="sm"
          @click="handleBackToChoose"
        >
          Back
        </Button>
      </div>

      <AvatarEditor
        :key="capturedFile?.name || 'editor'"
        :container-size="props.containerSize"
        :max-file-size="props.maxFileSize"
        :output-size="props.outputSize"
        :output-quality="props.outputQuality"
        :initial-file="capturedFile"
        @image-cropped="handleEditorSave"
        @cancel="handleEditorCancel"
        @error="handleCameraError"
      />
    </div>
  </div>
</template>
