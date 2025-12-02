import type {
  CameraDevice,
  CapturedPhoto
} from '../model/camera-capture.types';

/**
 * Request camera permissions and get media stream
 */
export async function requestCameraAccess(
  constraints: MediaStreamConstraints = {
    video: { facingMode: 'user' },
    audio: false
  }
): Promise<MediaStream> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    return stream;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'NotAllowedError') {
        throw new Error('Camera permission denied');
      } else if (error.name === 'NotFoundError') {
        throw new Error('No camera found');
      } else if (error.name === 'NotReadableError') {
        throw new Error('Camera is already in use');
      }
    }
    throw new Error('Failed to access camera');
  }
}

/**
 * Get list of available camera devices
 */
export async function getCameraDevices(): Promise<CameraDevice[]> {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices
      .filter(device => device.kind === 'videoinput')
      .map(device => ({
        deviceId: device.deviceId,
        label: device.label || `Camera ${device.deviceId.slice(0, 8)}`,
        kind: device.kind
      }));
    return cameras;
  } catch {
    return [];
  }
}

/**
 * Stop media stream and release camera
 */
export function stopMediaStream(stream: MediaStream | null): void {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
}

/**
 * Capture photo from video element
 */
export async function capturePhotoFromVideo(
  videoElement: HTMLVideoElement,
  quality: number = 0.95
): Promise<CapturedPhoto> {
  const canvas = document.createElement('canvas');
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Draw current video frame to canvas
  ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

  // Convert to blob
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      b => {
        if (b) resolve(b);
        else reject(new Error('Failed to create blob'));
      },
      'image/jpeg',
      quality
    );
  });

  // Create data URL
  const dataUrl = canvas.toDataURL('image/jpeg', quality);

  // Create file
  const timestamp = Date.now();
  const file = new File([blob], `camera-${timestamp}.jpg`, {
    type: 'image/jpeg'
  });

  return {
    blob,
    dataUrl,
    file,
    width: canvas.width,
    height: canvas.height,
    timestamp
  };
}

/**
 * Check if browser supports camera API
 */
export function isCameraSupported(): boolean {
  return !!(
    typeof navigator !== 'undefined' &&
    navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === 'function' &&
    typeof navigator.mediaDevices.enumerateDevices === 'function'
  );
}

/**
 * Get video constraints for specific device
 */
export function getVideoConstraints(
  deviceId?: string,
  facingMode: 'user' | 'environment' = 'user'
): MediaTrackConstraints {
  const constraints: MediaTrackConstraints = {
    width: { ideal: 1920 },
    height: { ideal: 1080 }
  };

  if (deviceId) {
    constraints.deviceId = { exact: deviceId };
  } else {
    constraints.facingMode = facingMode;
  }

  return constraints;
}
