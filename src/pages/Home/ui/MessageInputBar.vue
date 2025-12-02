<script setup lang="ts">
import { computed, ref } from 'vue';

import { ImagePlus, Paperclip, SendHorizontal, X } from 'lucide-vue-next';

import { MessageInput } from '@/features/message-input';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { ImageCarousel } from '@/shared/ui/image-carousel';

// Constants
const MAX_IMAGES = 10;

// Emits
const emit = defineEmits<{
  send: [data: { text: string; images: string[] }];
}>();

// State
const messageText = ref('');
const isMessageInputFocuse = ref(false);
const attachedImages = ref<string[]>([]);
const fileInputRef = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);
const isProcessing = ref(false);
const previewImageIndex = ref<number | null>(null);
const isPreviewOpen = ref(false);

// Computed
const canAddMoreImages = computed(
  () => attachedImages.value.length < MAX_IMAGES
);
const hasAttachments = computed(() => attachedImages.value.length > 0);
const hasContent = computed(
  () => messageText.value.trim().length > 0 || hasAttachments.value
);
const attachmentButtonTitle = computed(() => {
  if (!canAddMoreImages.value) {
    return `Maximum ${MAX_IMAGES} images reached`;
  }
  return `Attach images (${attachedImages.value.length}/${MAX_IMAGES})`;
});

// Methods
function onMessageInput(e: Event) {
  const el = e.target as HTMLTextAreaElement;
  messageText.value = el.value;

  // Auto-resize textarea
  el.style.height = '';
  el.style.height = el.scrollHeight + 'px';
}

function onSend() {
  if (!hasContent.value) return;

  emit('send', {
    text: messageText.value.trim(),
    images: attachedImages.value
  });

  // Clear everything after sending
  messageText.value = '';
  attachedImages.value = [];

  // Reset textarea height
  const textarea = document.querySelector(
    '.message-input-textarea'
  ) as HTMLTextAreaElement;
  if (textarea) {
    textarea.style.height = '';
  }
}

function onAttachClick() {
  if (canAddMoreImages.value) {
    fileInputRef.value?.click();
  }
}

async function processFiles(files: FileList | File[]) {
  const remainingSlots = MAX_IMAGES - attachedImages.value.length;
  const filesToProcess = Array.from(files)
    .filter(file => file.type.startsWith('image/'))
    .slice(0, remainingSlots);

  if (filesToProcess.length === 0) return;

  isProcessing.value = true;

  const promises = filesToProcess.map(file => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          resolve(result);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  });

  try {
    const results = await Promise.all(promises);
    attachedImages.value.push(...results);
  } finally {
    isProcessing.value = false;
  }
}

function onFileSelect(e: Event) {
  const input = e.target as HTMLInputElement;
  const files = input.files;

  if (files) {
    processFiles(files);
  }

  // Reset input so the same file can be selected again
  input.value = '';
}

function removeImage(index: number) {
  attachedImages.value.splice(index, 1);
  // Close preview if we removed the previewed image
  if (previewImageIndex.value === index) {
    closePreview();
  }
}

function openPreview(index: number) {
  previewImageIndex.value = index;
  isPreviewOpen.value = true;
}

function closePreview() {
  isPreviewOpen.value = false;
  setTimeout(() => {
    previewImageIndex.value = null;
  }, 150); // Wait for animation to complete
}

// Drag and drop handlers
function onDragEnter(e: DragEvent) {
  e.preventDefault();
  if (!canAddMoreImages.value) return;
  isDragging.value = true;
}

function onDragOver(e: DragEvent) {
  e.preventDefault();
  if (!canAddMoreImages.value) return;
  isDragging.value = true;
}

function onDragLeave(e: DragEvent) {
  e.preventDefault();
  // Only set to false if we're leaving the container, not a child
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  if (
    e.clientX <= rect.left ||
    e.clientX >= rect.right ||
    e.clientY <= rect.top ||
    e.clientY >= rect.bottom
  ) {
    isDragging.value = false;
  }
}

function onDrop(e: DragEvent) {
  e.preventDefault();
  isDragging.value = false;

  if (!canAddMoreImages.value) return;

  const files = e.dataTransfer?.files;
  if (files) {
    processFiles(files);
  }
}

// Keyboard handler
function onKeyDown(e: KeyboardEvent) {
  // Send on Ctrl+Enter or Cmd+Enter
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    onSend();
  }
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <!-- Input Area -->
    <div
      class="flex items-end justify-start gap-1"
      @dragenter="onDragEnter"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <!-- Attachment Button -->
      <Button
        @click="onAttachClick"
        variant="ghost"
        size="icon"
        :disabled="!canAddMoreImages"
        :title="attachmentButtonTitle"
        :aria-label="attachmentButtonTitle"
        class="group attachment-btn min-h-13 min-w-13 transition-all"
        :class="{
          'cursor-not-allowed opacity-40': !canAddMoreImages,
          'hover:scale-105': canAddMoreImages
        }"
      >
        <div class="relative">
          <Paperclip
            class="min-h-5 min-w-5 transition-transform group-hover:animate-[shake_0.3s_ease-in-out]"
          />
          <span
            v-if="hasAttachments"
            class="bg-primary text-primary-foreground absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full text-[10px] font-semibold"
          >
            {{ attachedImages.length }}
          </span>
        </div>
      </Button>

      <!-- Hidden File Input -->
      <input
        ref="fileInputRef"
        type="file"
        accept="image/*"
        multiple
        class="hidden"
        @change="onFileSelect"
        aria-label="Select images to attach"
      />

      <!-- Message Input Container -->
      <div
        :class="
          cn(
            'relative flex grow flex-col items-start justify-start rounded-lg border transition-all',
            {
              'border-accent ring-accent/20 shadow-sm ring-2':
                isMessageInputFocuse,
              'border-primary/60 bg-accent/10 ring-primary/30 ring-2':
                isDragging
            }
          )
        "
      >
        <!-- Drag Overlay -->
        <Transition
          enter-active-class="transition duration-150 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div
            v-if="isDragging"
            class="bg-accent/90 border-primary pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-lg border-2 border-dashed backdrop-blur-sm"
          >
            <div class="text-primary flex flex-col items-center gap-2">
              <ImagePlus class="h-8 w-8" />
              <p class="text-sm font-medium">Drop images here</p>
              <p class="text-muted-foreground text-xs">
                {{ attachedImages.length }}/{{ MAX_IMAGES }} images
              </p>
            </div>
          </div>
        </Transition>

        <!-- Image Previews -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 max-h-0"
          enter-to-class="opacity-100 max-h-96"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 max-h-96"
          leave-to-class="opacity-0 max-h-0"
        >
          <div
            v-if="hasAttachments"
            class="flex w-full flex-wrap gap-2 border-b p-2.5 pb-2"
          >
            <TransitionGroup
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="opacity-0 scale-90"
              enter-to-class="opacity-100 scale-100"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="opacity-100 scale-100"
              leave-to-class="opacity-0 scale-90"
              move-class="transition duration-200"
            >
              <div
                v-for="(image, index) in attachedImages"
                :key="`${image}-${index}`"
                class="group bg-background relative size-16 overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-md"
              >
                <img
                  :src="image"
                  :alt="`Attachment ${index + 1}`"
                  class="h-full w-full cursor-pointer object-cover transition-transform group-hover:scale-110"
                  @click="openPreview(index)"
                />
                <div
                  class="pointer-events-none absolute inset-0 bg-linear-to-t from-black/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
                />
                <Button
                  @click.stop="removeImage(index)"
                  variant="destructive"
                  size="icon"
                  :title="`Remove image ${index + 1}`"
                  :aria-label="`Remove image ${index + 1}`"
                  class="absolute top-1 right-1 h-5 w-5 opacity-0 shadow-md transition-all group-hover:scale-110 group-hover:opacity-100"
                >
                  <X class="h-3 w-3" />
                </Button>
              </div>
            </TransitionGroup>

            <!-- Add more indicator -->
            <button
              v-if="canAddMoreImages"
              @click="onAttachClick"
              class="border-muted-foreground/30 hover:border-primary hover:bg-accent flex size-16 items-center justify-center rounded-lg border-2 border-dashed transition-all hover:scale-105"
              :title="`Add more images (${attachedImages.length}/${MAX_IMAGES})`"
            >
              <div class="text-muted-foreground flex flex-col items-center">
                <ImagePlus class="h-5 w-5" />
                <span class="text-[10px] font-medium">
                  {{ attachedImages.length }}/{{ MAX_IMAGES }}
                </span>
              </div>
            </button>
          </div>
        </Transition>

        <!-- Processing Indicator -->
        <Transition
          enter-active-class="transition duration-150 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div
            v-if="isProcessing"
            class="text-muted-foreground flex w-full items-center gap-2 px-3 py-1.5 text-xs"
          >
            <div
              class="border-primary h-3 w-3 animate-spin rounded-full border-2 border-t-transparent"
            />
            <span>Processing images...</span>
          </div>
        </Transition>

        <!-- Text Input -->
        <div class="flex w-full items-center p-1.5">
          <MessageInput
            v-model="messageText"
            @input="onMessageInput"
            @focus="isMessageInputFocuse = true"
            @blur="isMessageInputFocuse = false"
            @keydown="onKeyDown"
            class="message-input-textarea h-10 max-h-75 min-h-0 w-full"
          />
        </div>
      </div>

      <!-- Send Button -->
      <Button
        @click="onSend"
        variant="ghost"
        size="icon"
        :disabled="!hasContent"
        :title="hasContent ? 'Send message' : 'Type a message or add images'"
        :aria-label="
          hasContent ? 'Send message' : 'Type a message or add images'
        "
        class="group min-h-13 min-w-13 transition-all"
        :class="{
          'cursor-not-allowed opacity-40': !hasContent,
          'hover:scale-105': hasContent
        }"
      >
        <SendHorizontal
          class="ease-bounce min-h-5 min-w-5 transition-all"
          :class="{
            'group-hover:scale-125 group-hover:rotate-[-30deg]': hasContent
          }"
        />
      </Button>
    </div>

    <!-- Image Preview Carousel -->
    <ImageCarousel
      :images="attachedImages"
      :initial-index="previewImageIndex ?? 0"
      :open="isPreviewOpen"
      @update:open="isPreviewOpen = $event"
    />
  </div>
</template>

<style>
@keyframes shake {
  0%,
  100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-10deg);
  }
  75% {
    transform: rotate(10deg);
  }
}
</style>
