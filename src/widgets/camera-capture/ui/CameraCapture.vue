<script setup lang="ts">
import { onMounted, watch } from 'vue';

import { CameraIcon, CameraOffIcon, SwitchCameraIcon } from 'lucide-vue-next';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';

import type { CapturedPhoto } from '../model/camera-capture.types';
import { useCameraCapture } from '../model/use-camera-capture';

interface Props {
  autoStart?: boolean;
  facingMode?: 'user' | 'environment';
  captureQuality?: number;
  width?: number;
  height?: number;
}

const props = withDefaults(defineProps<Props>(), {
  autoStart: true,
  facingMode: 'user',
  captureQuality: 0.95,
  width: 640,
  height: 480
});

const emit = defineEmits<{
  captured: [photo: CapturedPhoto];
  error: [error: string];
  started: [];
  stopped: [];
}>();

const {
  state,
  videoRef,
  isLoading,
  isSupported,
  startCamera,
  stopCamera,
  switchCamera,
  capturePhoto
} = useCameraCapture();

// Auto-start camera on mount if enabled
onMounted(() => {
  if (props.autoStart) {
    handleStartCamera();
  }
});

// Watch for errors and emit them
watch(
  () => state.value.error,
  error => {
    if (error) {
      emit('error', error);
    }
  }
);

async function handleStartCamera(): Promise<void> {
  await startCamera(undefined, props.facingMode);
  if (state.value.stream) {
    emit('started');
  }
}

function handleStopCamera(): void {
  stopCamera();
  emit('stopped');
}

async function handleSwitchCamera(): Promise<void> {
  // Toggle between available devices
  const currentIndex = state.value.devices.findIndex(
    d => d.deviceId === state.value.selectedDeviceId
  );
  const nextIndex = (currentIndex + 1) % state.value.devices.length;
  const nextDevice = state.value.devices[nextIndex];

  if (nextDevice) {
    await switchCamera(nextDevice.deviceId);
  }
}

async function handleCapture(): Promise<void> {
  const photo = await capturePhoto(props.captureQuality);

  if (photo) {
    emit('captured', photo);
  }
}
</script>

<template>
  <div class="flex w-full flex-col items-center gap-4">
    <!-- Camera Preview Container -->
    <div
      :class="
        cn(
          'bg-muted relative overflow-hidden rounded-lg',
          !state.stream && 'border-muted-foreground/25 border-2 border-dashed'
        )
      "
      :style="{
        width: `${width}px`,
        height: `${height}px`
      }"
    >
      <!-- No Camera Support -->
      <div
        v-if="!isSupported"
        class="flex h-full w-full flex-col items-center justify-center gap-4 p-8 text-center"
      >
        <CameraOffIcon class="text-muted-foreground size-16" />
        <div>
          <p class="text-muted-foreground text-sm font-medium">
            Camera not supported
          </p>
          <p class="text-muted-foreground/75 mt-1 text-xs">
            Your browser doesn't support camera access
          </p>
        </div>
      </div>

      <!-- Camera Not Started -->
      <div
        v-else-if="!state.stream && !isLoading"
        class="flex h-full w-full flex-col items-center justify-center gap-4 p-8 text-center"
      >
        <CameraIcon class="text-muted-foreground size-16" />
        <div>
          <p class="text-muted-foreground text-sm font-medium">Camera is off</p>
          <p class="text-muted-foreground/75 mt-1 text-xs">
            Click "Start Camera" to begin
          </p>
        </div>
      </div>

      <!-- Loading State -->
      <div
        v-else-if="isLoading"
        class="flex h-full w-full flex-col items-center justify-center gap-4"
      >
        <div
          class="border-primary size-12 animate-spin rounded-full border-4 border-t-transparent"
        />
        <p class="text-muted-foreground text-sm">Starting camera...</p>
      </div>

      <!-- Video Preview -->
      <video
        v-show="state.stream && !isLoading"
        ref="videoRef"
        autoplay
        playsinline
        class="size-full object-cover"
      />

      <!-- Capture Overlay -->
      <div
        v-if="state.isCapturing"
        class="bg-background/80 absolute inset-0 flex items-center justify-center"
      >
        <div class="flex flex-col items-center gap-2">
          <div
            class="border-primary size-12 animate-spin rounded-full border-4 border-t-transparent"
          />
          <p class="text-muted-foreground text-sm">Capturing...</p>
        </div>
      </div>

      <!-- Camera Controls Overlay -->
      <div
        v-if="state.stream"
        class="absolute right-0 bottom-4 left-0 flex justify-center gap-2"
      >
        <Button
          v-if="state.devices.length > 1"
          variant="secondary"
          size="icon"
          class="size-10"
          @click="handleSwitchCamera"
        >
          <SwitchCameraIcon class="size-5" />
        </Button>
      </div>
    </div>

    <!-- Error Message -->
    <div
      v-if="state.error"
      class="bg-destructive/10 text-destructive rounded-md p-3 text-sm"
    >
      {{ state.error }}
    </div>

    <!-- Control Buttons -->
    <div class="flex justify-center gap-6">
      <Button
        v-if="!state.stream"
        :disabled="!isSupported || isLoading"
        @click="handleStartCamera"
      >
        <CameraIcon class="mr-2 size-4" />
        Start Camera
      </Button>

      <template v-else>
        <Button variant="outline" @click="handleStopCamera">
          <CameraOffIcon class="mr-2 size-4" />
          Stop Camera
        </Button>

        <Button :disabled="state.isCapturing" @click="handleCapture">
          <CameraIcon class="mr-2 size-4" />
          Capture Photo
        </Button>
      </template>
    </div>
  </div>
</template>
