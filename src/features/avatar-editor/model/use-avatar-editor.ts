import { computed, ref } from 'vue';

import {
  calculateInitialCropData,
  calculateScaleLimits,
  constrainPosition,
  cropImageToSquare,
  loadImage,
  loadImageFile,
  validateImageFile
} from '../lib/image-utils';
import type {
  AvatarEditorOptions,
  AvatarEditorState,
  CroppedImageResult
} from './avatar-editor.types';

const DEFAULT_OPTIONS: Required<AvatarEditorOptions> = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  outputSize: 512,
  outputQuality: 0.92
};

export function useAvatarEditor(
  containerSize: number = 400,
  options: AvatarEditorOptions = {}
) {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

  const state = ref<AvatarEditorState>({
    imageUrl: null,
    originalFile: null,
    cropData: {
      x: 0,
      y: 0,
      scale: 1,
      width: 0,
      height: 0
    },
    isDragging: false
  });

  const error = ref<string | null>(null);
  const isProcessing = ref(false);

  // Computed properties
  const hasImage = computed(() => !!state.value.imageUrl);

  const scaleLimits = computed(() => {
    if (!state.value.cropData.width || !state.value.cropData.height) {
      return { min: 1, max: 3 };
    }
    return calculateScaleLimits(
      state.value.cropData.width,
      state.value.cropData.height,
      containerSize
    );
  });

  const scalePercent = computed(() => {
    return Math.round(state.value.cropData.scale * 100);
  });

  // Methods
  async function loadFile(file: File): Promise<void> {
    error.value = null;
    isProcessing.value = true;

    try {
      // Validate file
      const validation = validateImageFile(
        file,
        mergedOptions.maxFileSize,
        mergedOptions.allowedTypes
      );

      if (!validation.valid) {
        error.value = validation.error || 'Invalid file';
        return;
      }

      // Load file as data URL
      const dataUrl = await loadImageFile(file);

      // Load image to get dimensions
      const img = await loadImage(dataUrl);

      // Calculate initial crop data
      const initialCropData = calculateInitialCropData(
        img.naturalWidth,
        img.naturalHeight,
        containerSize
      );

      // Update state
      state.value = {
        imageUrl: dataUrl,
        originalFile: file,
        cropData: initialCropData,
        isDragging: false
      };
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load image';
    } finally {
      isProcessing.value = false;
    }
  }

  function setScale(scale: number): void {
    const newScale = Math.max(
      scaleLimits.value.min,
      Math.min(scaleLimits.value.max, scale)
    );

    const oldScale = state.value.cropData.scale;
    const scaleRatio = newScale / oldScale;

    // Calculate the center point of the container
    const centerX = containerSize / 2;
    const centerY = containerSize / 2;

    // Calculate the current position relative to center
    const oldWidth = state.value.cropData.width * oldScale;
    const oldHeight = state.value.cropData.height * oldScale;
    const oldCenterX = state.value.cropData.x + oldWidth / 2;
    const oldCenterY = state.value.cropData.y + oldHeight / 2;

    // Calculate offset from container center
    const offsetX = oldCenterX - centerX;
    const offsetY = oldCenterY - centerY;

    // Scale the offset
    const newOffsetX = offsetX * scaleRatio;
    const newOffsetY = offsetY * scaleRatio;

    // Calculate new position
    const newWidth = state.value.cropData.width * newScale;
    const newHeight = state.value.cropData.height * newScale;
    const newX = centerX + newOffsetX - newWidth / 2;
    const newY = centerY + newOffsetY - newHeight / 2;

    // Constrain position when scaling
    const constrained = constrainPosition(
      newX,
      newY,
      state.value.cropData.width,
      state.value.cropData.height,
      newScale,
      containerSize
    );

    state.value.cropData = {
      ...state.value.cropData,
      scale: newScale,
      x: constrained.x,
      y: constrained.y
    };
  }

  function setPosition(x: number, y: number): void {
    const constrained = constrainPosition(
      x,
      y,
      state.value.cropData.width,
      state.value.cropData.height,
      state.value.cropData.scale,
      containerSize
    );

    state.value.cropData = {
      ...state.value.cropData,
      x: constrained.x,
      y: constrained.y
    };
  }

  function moveImage(deltaX: number, deltaY: number): void {
    setPosition(
      state.value.cropData.x + deltaX,
      state.value.cropData.y + deltaY
    );
  }

  function setDragging(isDragging: boolean): void {
    state.value.isDragging = isDragging;
  }

  function resetZoom(): void {
    if (!state.value.imageUrl) return;

    const initialCropData = calculateInitialCropData(
      state.value.cropData.width,
      state.value.cropData.height,
      containerSize
    );

    state.value.cropData = {
      ...state.value.cropData,
      ...initialCropData
    };
  }

  async function getCroppedImage(): Promise<CroppedImageResult | null> {
    if (!state.value.imageUrl) {
      error.value = 'No image loaded';
      return null;
    }

    isProcessing.value = true;
    error.value = null;

    try {
      const result = await cropImageToSquare(
        state.value.imageUrl,
        state.value.cropData,
        mergedOptions.outputSize,
        mergedOptions.outputQuality
      );

      return result;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to crop image';
      return null;
    } finally {
      isProcessing.value = false;
    }
  }

  function reset(): void {
    state.value = {
      imageUrl: null,
      originalFile: null,
      cropData: {
        x: 0,
        y: 0,
        scale: 1,
        width: 0,
        height: 0
      },
      isDragging: false
    };
    error.value = null;
    isProcessing.value = false;
  }

  return {
    // State
    state,
    error,
    isProcessing,

    // Computed
    hasImage,
    scaleLimits,
    scalePercent,

    // Methods
    loadFile,
    setScale,
    setPosition,
    moveImage,
    setDragging,
    resetZoom,
    getCroppedImage,
    reset
  };
}
