<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-vue-next';

import { Button } from '@/shared/ui/button';

interface Props {
  images: string[];
  initialIndex?: number;
  open?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  initialIndex: 0,
  open: false
});

const emit = defineEmits<{
  'update:open': [value: boolean];
}>();

// State
const currentIndex = ref(props.initialIndex);
const zoom = ref(1);
const isDragging = ref(false);
const startPos = ref({ x: 0, y: 0 });
const translatePos = ref({ x: 0, y: 0 });

// Computed
const currentImage = computed(() => props.images[currentIndex.value]);
const canNavigatePrev = computed(() => currentIndex.value > 0);
const canNavigateNext = computed(
  () => currentIndex.value < props.images.length - 1
);
const isZoomed = computed(() => zoom.value > 1);

// Watch for initial index changes
watch(
  () => props.initialIndex,
  newIndex => {
    currentIndex.value = newIndex;
    resetZoom();
  }
);

watch(
  () => props.open,
  isOpen => {
    if (!isOpen) {
      resetZoom();
    }
  }
);

// Methods
function navigatePrev() {
  if (canNavigatePrev.value) {
    currentIndex.value--;
    resetZoom();
  }
}

function navigateNext() {
  if (canNavigateNext.value) {
    currentIndex.value++;
    resetZoom();
  }
}

function zoomIn() {
  zoom.value = Math.min(zoom.value + 0.5, 3);
}

function zoomOut() {
  zoom.value = Math.max(zoom.value - 0.5, 1);
  if (zoom.value === 1) {
    translatePos.value = { x: 0, y: 0 };
  }
}

function resetZoom() {
  zoom.value = 1;
  translatePos.value = { x: 0, y: 0 };
}

function close() {
  emit('update:open', false);
}

// Keyboard navigation
function onKeyDown(e: KeyboardEvent) {
  if (!props.open) return;

  if (e.key === 'Escape') {
    e.preventDefault();
    close();
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    navigatePrev();
  } else if (e.key === 'ArrowRight') {
    e.preventDefault();
    navigateNext();
  } else if (e.key === '+' || e.key === '=') {
    e.preventDefault();
    zoomIn();
  } else if (e.key === '-' || e.key === '_') {
    e.preventDefault();
    zoomOut();
  }
}

// Pan functionality
function onMouseDown(e: MouseEvent) {
  if (!isZoomed.value) return;

  isDragging.value = true;
  startPos.value = {
    x: e.clientX - translatePos.value.x,
    y: e.clientY - translatePos.value.y
  };
}

function onMouseMove(e: MouseEvent) {
  if (!isDragging.value || !isZoomed.value) return;

  translatePos.value = {
    x: e.clientX - startPos.value.x,
    y: e.clientY - startPos.value.y
  };
}

function onMouseUp() {
  isDragging.value = false;
}

function onWheel(e: WheelEvent) {
  e.preventDefault();
  if (e.deltaY < 0) {
    zoomIn();
  } else {
    zoomOut();
  }
}

// Add keyboard listener
if (typeof window !== 'undefined') {
  watch(
    () => props.open,
    isOpen => {
      if (isOpen) {
        window.addEventListener('keydown', onKeyDown);
      } else {
        window.removeEventListener('keydown', onKeyDown);
      }
    },
    { immediate: true }
  );
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-xs"
      @click="close"
    >
      <!-- Close Button -->
      <Button
        @click.stop="close"
        variant="ghost"
        size="icon"
        class="absolute top-4 right-4 z-20 h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm transition-all hover:bg-white/20"
        title="Close (Esc)"
      >
        <X class="h-6 w-6 text-white" />
      </Button>

      <!-- Previous Button -->
      <Button
        v-if="images.length > 1"
        @click.stop="navigatePrev"
        variant="ghost"
        size="icon"
        :disabled="!canNavigatePrev"
        class="absolute top-1/2 left-4 z-10 h-12 w-12 -translate-y-1/2 rounded-full bg-white/10 backdrop-blur-sm transition-all hover:bg-white/20"
        :class="{ 'opacity-50': !canNavigatePrev }"
        title="Previous image (←)"
      >
        <ChevronLeft class="h-8 w-8 text-white" />
      </Button>

      <!-- Image Container -->
      <div
        class="relative flex h-full w-full items-center justify-center overflow-hidden"
        @click.stop
        @mousedown="onMouseDown"
        @mousemove="onMouseMove"
        @mouseup="onMouseUp"
        @mouseleave="onMouseUp"
        @wheel="onWheel"
        :class="{
          'cursor-grab': isZoomed && !isDragging,
          'cursor-grabbing': isDragging
        }"
      >
        <img
          v-if="currentImage"
          :src="currentImage"
          :alt="`Image ${currentIndex + 1}`"
          class="max-h-[90vh] max-w-[90vw] object-contain transition-transform duration-200 select-none"
          :style="{
            transform: `scale(${zoom}) translate(${translatePos.x / zoom}px, ${translatePos.y / zoom}px)`
          }"
          draggable="false"
        />
      </div>

      <!-- Next Button -->
      <Button
        v-if="images.length > 1"
        @click.stop="navigateNext"
        variant="ghost"
        size="icon"
        :disabled="!canNavigateNext"
        class="absolute top-1/2 right-4 z-10 h-12 w-12 -translate-y-1/2 rounded-full bg-white/10 backdrop-blur-sm transition-all hover:bg-white/20"
        :class="{ 'opacity-50': !canNavigateNext }"
        title="Next image (→)"
      >
        <ChevronRight class="h-8 w-8 text-white" />
      </Button>

      <!-- Zoom Controls -->
      <div
        @click.stop
        class="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2 rounded-full bg-white/10 p-2 backdrop-blur-sm"
      >
        <Button
          @click="zoomOut"
          variant="ghost"
          size="icon"
          :disabled="zoom <= 1"
          class="h-8 w-8 rounded-full hover:bg-white/20"
          title="Zoom out (-)"
        >
          <ZoomOut class="h-5 w-5 text-white" />
        </Button>
        <div
          class="flex min-w-12 items-center justify-center text-sm font-medium text-white"
        >
          {{ Math.round(zoom * 100) }}%
        </div>
        <Button
          @click="zoomIn"
          variant="ghost"
          size="icon"
          :disabled="zoom >= 3"
          class="h-8 w-8 rounded-full hover:bg-white/20"
          title="Zoom in (+)"
        >
          <ZoomIn class="h-5 w-5 text-white" />
        </Button>
      </div>

      <!-- Counter -->
      <div
        v-if="images.length > 1"
        class="absolute top-6 left-1/2 z-10 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm"
        @click.stop
      >
        <p class="text-sm font-medium text-white">
          {{ currentIndex + 1 }} / {{ images.length }}
        </p>
      </div>
    </div>
  </Transition>
</template>
