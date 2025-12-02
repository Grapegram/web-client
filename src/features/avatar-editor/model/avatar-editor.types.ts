export interface ImageCropData {
  x: number;
  y: number;
  scale: number;
  width: number;
  height: number;
}

export interface AvatarEditorState {
  imageUrl: string | null;
  originalFile: File | null;
  cropData: ImageCropData;
  isDragging: boolean;
}

export interface CroppedImageResult {
  blob: Blob;
  dataUrl: string;
  file: File;
}

export interface AvatarEditorOptions {
  maxFileSize?: number; // in bytes
  allowedTypes?: string[];
  outputSize?: number; // output image size (width and height)
  outputQuality?: number; // 0-1
}
