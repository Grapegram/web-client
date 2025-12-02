export interface CameraDevice {
  deviceId: string;
  label: string;
  kind: MediaDeviceKind;
}

export interface CameraConstraints {
  width?: number;
  height?: number;
  facingMode?: 'user' | 'environment';
  deviceId?: string;
}

export interface CameraCaptureState {
  stream: MediaStream | null;
  devices: CameraDevice[];
  selectedDeviceId: string | null;
  isCapturing: boolean;
  hasPermission: boolean | null;
  error: string | null;
}

export interface CapturedPhoto {
  blob: Blob;
  dataUrl: string;
  file: File;
  width: number;
  height: number;
  timestamp: number;
}
