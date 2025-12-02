<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

import { InfoIcon, RotateCcwIcon } from 'lucide-vue-next';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Slider } from '@/shared/ui/slider';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/shared/ui/tooltip';

import { useAvatarEditor } from '../model/use-avatar-editor';

interface Props {
  containerSize?: number;
  maxFileSize?: number;
  outputSize?: number;
  outputQuality?: number;
  initialFile?: File | null;
}

const props = withDefaults(defineProps<Props>(), {
  containerSize: 400,
  maxFileSize: 10 * 1024 * 1024,
  outputSize: 512,
  outputQuality: 0.92,
  initialFile: null
});

const emit = defineEmits<{
  imageSelected: [file: File];
  imageCropped: [result: { blob: Blob; dataUrl: string; file: File }];
  cancel: [];
  error: [error: string];
}>();

const {
  state,
  error,
  isProcessing,
  hasImage,
  scaleLimits,
  loadFile,
  setScale,
  moveImage,
  setDragging,
  resetZoom,
  getCroppedImage,
  reset
} = useAvatarEditor(props.containerSize, {
  maxFileSize: props.maxFileSize,
  outputSize: props.outputSize,
  outputQuality: props.outputQuality
});

const fileInputRef = ref<HTMLInputElement>();
const containerRef = ref<HTMLDivElement>();

// Drag state
const dragStart = ref({ x: 0, y: 0 });

// Computed styles
const imageStyle = computed(() => {
  if (!state.value.imageUrl) return {};

  const scaledWidth = state.value.cropData.width * state.value.cropData.scale;
  const scaledHeight = state.value.cropData.height * state.value.cropData.scale;

  return {
    width: `${scaledWidth}px`,
    height: `${scaledHeight}px`,
    transform: `translate(${state.value.cropData.x}px, ${state.value.cropData.y}px)`,
    cursor: state.value.isDragging ? 'grabbing' : 'grab',
    maxWidth: 'none',
    objectFit: 'cover'
  };
});

// File input handlers
function handleFileSelect(event: Event): void {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (file) {
    handleFileLoad(file);
  }
}

async function handleFileLoad(file: File): Promise<void> {
  await loadFile(file);

  if (!error.value) {
    emit('imageSelected', file);
  } else {
    emit('error', error.value);
  }
}

// Auto-load initial file if provided
watch(
  () => props.initialFile,
  file => {
    if (file) {
      handleFileLoad(file);
    }
  },
  { immediate: true }
);

function openFileDialog(): void {
  fileInputRef.value?.click();
}

// Drag handlers
function handleMouseDown(event: MouseEvent): void {
  if (!hasImage.value) return;

  event.preventDefault();
  setDragging(true);
  dragStart.value = {
    x: event.clientX,
    y: event.clientY
  };
}

function handleMouseMove(event: MouseEvent): void {
  if (!state.value.isDragging) return;

  event.preventDefault();

  const deltaX = event.clientX - dragStart.value.x;
  const deltaY = event.clientY - dragStart.value.y;

  moveImage(deltaX, deltaY);

  dragStart.value = {
    x: event.clientX,
    y: event.clientY
  };
}

function handleMouseUp(): void {
  if (state.value.isDragging) {
    setDragging(false);
  }
}

// Touch handlers for mobile
function handleTouchStart(event: TouchEvent): void {
  if (!hasImage.value || event.touches.length !== 1) return;

  const touch = event.touches[0];
  setDragging(true);
  dragStart.value = {
    x: touch.clientX,
    y: touch.clientY
  };
}

function handleTouchMove(event: TouchEvent): void {
  if (!state.value.isDragging || event.touches.length !== 1) return;

  event.preventDefault();

  const touch = event.touches[0];
  const deltaX = touch.clientX - dragStart.value.x;
  const deltaY = touch.clientY - dragStart.value.y;

  moveImage(deltaX, deltaY);

  dragStart.value = {
    x: touch.clientX,
    y: touch.clientY
  };
}

function handleTouchEnd(): void {
  if (state.value.isDragging) {
    setDragging(false);
  }
}

// Zoom handlers
function handleZoomChange(value: number[]): void {
  setScale(value[0]);
}

function handleWheel(event: WheelEvent): void {
  if (!hasImage.value) return;

  event.preventDefault();

  // Exponential zoom for smooth experience
  // Negative deltaY = zoom in, positive = zoom out
  const zoomFactor = 0.03; // Adjust this for zoom speed
  const multiplier = 1 + (event.deltaY > 0 ? -zoomFactor : zoomFactor);
  const newScale = state.value.cropData.scale * multiplier;

  setScale(newScale);
}

function handleResetZoom(): void {
  resetZoom();
}

// Crop handler
async function handleCrop(): Promise<void> {
  const result = await getCroppedImage();

  if (result) {
    emit('imageCropped', result);
  } else if (error.value) {
    emit('error', error.value);
  }
}

// Cancel handler
function handleCancel(): void {
  emit('cancel');
}

// Drag and drop handlers
function handleDragOver(event: DragEvent): void {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'copy';
  }
}

function handleDrop(event: DragEvent): void {
  event.preventDefault();

  const file = event.dataTransfer?.files[0];
  if (file && file.type.startsWith('image/')) {
    handleFileLoad(file);
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
  document.addEventListener('touchmove', handleTouchMove, { passive: false });
  document.addEventListener('touchend', handleTouchEnd);

  // Add wheel event to container for zooming
  if (containerRef.value) {
    containerRef.value.addEventListener('wheel', handleWheel, {
      passive: false
    });
  }
});

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
  document.removeEventListener('touchmove', handleTouchMove);
  document.removeEventListener('touchend', handleTouchEnd);

  // Remove wheel event
  if (containerRef.value) {
    containerRef.value.removeEventListener('wheel', handleWheel);
  }
});
</script>

<template>
  <div class="flex w-full flex-col gap-6">
    <!-- Editor Container -->
    <div class="flex flex-col gap-4">
      <!-- Canvas Container -->
      <div
        ref="containerRef"
        :class="
          cn(
            'bg-muted relative mx-auto overflow-hidden rounded-lg border-2 border-dashed',
            hasImage ? 'border-primary' : 'border-muted-foreground/25'
          )
        "
        :style="{
          width: `${containerSize}px`,
          height: `${containerSize}px`
        }"
        @dragover="handleDragOver"
        @drop="handleDrop"
      >
        <!-- Empty State -->
        <div
          v-if="!hasImage"
          class="flex h-full w-full flex-col items-center justify-center gap-4 p-8 text-center"
        >
          <svg
            class="text-muted-foreground/50 size-16"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <div>
            <p class="text-muted-foreground text-sm font-medium">
              Drop an image here or click to upload
            </p>
            <p class="text-muted-foreground/75 mt-1 text-xs">
              PNG, JPG, WebP or GIF (max {{ maxFileSize / (1024 * 1024) }}MB)
            </p>
          </div>
          <Button @click="openFileDialog">Choose Image</Button>
        </div>

        <!-- Image Editor -->
        <div
          v-else
          class="relative size-full overflow-hidden"
          @mousedown="handleMouseDown"
          @touchstart="handleTouchStart"
        >
          <!-- Circular mask overlay -->
          <div class="pointer-events-none absolute inset-0 z-10">
            <svg class="size-full">
              <defs>
                <mask id="circleMask">
                  <rect
                    width="100%"
                    height="100%"
                    fill="var(--color-primary-foreground)"
                  />
                  <circle
                    :cx="containerSize / 2 - 2"
                    :cy="containerSize / 2 - 2"
                    :r="containerSize / 2 - 1"
                    fill="black"
                  />
                </mask>
              </defs>
              <rect
                width="100%"
                height="100%"
                fill="rgba(0, 0, 0, 0.5)"
                mask="url(#circleMask)"
              />
            </svg>
          </div>

          <!-- Circle border -->
          <div class="pointer-events-none absolute inset-0 z-20">
            <svg class="size-full">
              <circle
                :cx="containerSize / 2 - 1"
                :cy="containerSize / 2 - 1"
                :r="containerSize / 2 - 2"
                fill="none"
                stroke="var(--color-primary-foreground)"
                stroke-width="3"
              />
            </svg>
          </div>

          <!-- Image -->
          <img
            :src="state.imageUrl!"
            :style="imageStyle"
            alt="Avatar preview"
            class="absolute top-0 left-0 select-none"
            draggable="false"
          />
        </div>

        <!-- Loading overlay -->
        <div
          v-if="isProcessing"
          class="bg-background/80 absolute inset-0 z-30 flex items-center justify-center"
        >
          <div class="flex flex-col items-center gap-2">
            <div
              class="border-primary size-8 animate-spin rounded-full border-4 border-t-transparent"
            />
            <p class="text-muted-foreground text-sm">Processing...</p>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div
        v-if="error"
        class="bg-destructive/10 text-destructive rounded-md p-3 text-sm"
      >
        {{ error }}
      </div>
      <!-- Controls -->
      <div v-if="hasImage" class="flex flex-col gap-4">
        <!-- Zoom Slider -->
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium">Zoom:</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger as-child>
                  <button
                    type="button"
                    class="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <InfoIcon class="size-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" class="max-w-xs">
                  <p class="text-xs">
                    Drag the image to reposition it within the circle. Use the
                    zoom slider or mouse wheel to adjust the size.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Slider
            :model-value="[state.cropData.scale]"
            :min="scaleLimits.min"
            :max="scaleLimits.max"
            :step="0.01"
            class="flex-1"
            @update:model-value="handleZoomChange"
          />
          <Button
            variant="outline"
            size="icon"
            class="size-8"
            @click="handleResetZoom"
          >
            <RotateCcwIcon class="size-4" />
          </Button>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-center gap-6">
      <Button variant="outline" @click="handleCancel">
        {{ hasImage ? 'Cancel' : 'Close' }}
      </Button>
      <Button v-if="!hasImage" @click="openFileDialog"> Choose Image </Button>
      <Button v-else :disabled="isProcessing" @click="handleCrop">
        {{ isProcessing ? 'Processing...' : 'Crop & Save' }}
      </Button>
    </div>

    <!-- Hidden File Input -->
    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleFileSelect"
    />
  </div>
</template>
