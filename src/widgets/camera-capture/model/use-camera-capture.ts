import { onUnmounted, ref } from 'vue';

import {
  capturePhotoFromVideo,
  getCameraDevices,
  getVideoConstraints,
  isCameraSupported,
  requestCameraAccess,
  stopMediaStream
} from '../lib/camera-utils';
import type {
  CameraCaptureState,
  CameraDevice,
  CapturedPhoto
} from './camera-capture.types';

export function useCameraCapture() {
  const state = ref<CameraCaptureState>({
    stream: null,
    devices: [],
    selectedDeviceId: null,
    isCapturing: false,
    hasPermission: null,
    error: null
  });

  const videoRef = ref<HTMLVideoElement | null>(null);
  const isLoading = ref(false);

  // Check if camera is supported
  const isSupported = isCameraSupported();

  // Start camera
  async function startCamera(
    deviceId?: string,
    facingMode: 'user' | 'environment' = 'user'
  ): Promise<void> {
    if (!isSupported) {
      state.value.error = 'Camera not supported in this browser';
      return;
    }

    isLoading.value = true;
    state.value.error = null;

    try {
      // Stop existing stream if any
      if (state.value.stream) {
        stopMediaStream(state.value.stream);
      }

      // Get video constraints
      const videoConstraints = getVideoConstraints(deviceId, facingMode);

      // Request camera access
      const stream = await requestCameraAccess({
        video: videoConstraints,
        audio: false
      });

      state.value.stream = stream;
      state.value.hasPermission = true;
      state.value.selectedDeviceId = deviceId || null;

      // Attach stream to video element
      if (videoRef.value) {
        videoRef.value.srcObject = stream;
      }

      // Get available devices after permission is granted
      const devices = await getCameraDevices();
      state.value.devices = devices;
    } catch (error) {
      state.value.hasPermission = false;
      state.value.error =
        error instanceof Error ? error.message : 'Failed to start camera';
    } finally {
      isLoading.value = false;
    }
  }

  // Stop camera
  function stopCamera(): void {
    if (state.value.stream) {
      stopMediaStream(state.value.stream);
      state.value.stream = null;
    }

    if (videoRef.value) {
      videoRef.value.srcObject = null;
    }
  }

  // Switch camera device
  async function switchCamera(deviceId: string): Promise<void> {
    await startCamera(deviceId);
  }

  // Capture photo
  async function capturePhoto(
    quality: number = 0.95
  ): Promise<CapturedPhoto | null> {
    if (!videoRef.value || !state.value.stream) {
      state.value.error = 'Camera not started';
      return null;
    }

    state.value.isCapturing = true;
    state.value.error = null;

    try {
      const photo = await capturePhotoFromVideo(videoRef.value, quality);
      return photo;
    } catch (error) {
      state.value.error =
        error instanceof Error ? error.message : 'Failed to capture photo';
      return null;
    } finally {
      state.value.isCapturing = false;
    }
  }

  // Get available devices (requires permission first)
  async function refreshDevices(): Promise<CameraDevice[]> {
    const devices = await getCameraDevices();
    state.value.devices = devices;
    return devices;
  }

  // Cleanup on unmount
  onUnmounted(() => {
    stopCamera();
  });

  return {
    // State
    state,
    videoRef,
    isLoading,
    isSupported,

    // Methods
    startCamera,
    stopCamera,
    switchCamera,
    capturePhoto,
    refreshDevices
  };
}
