import type {
  CroppedImageResult,
  ImageCropData
} from '../model/avatar-editor.types';

/**
 * Load an image file and return a data URL
 */
export async function loadImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Load an image element from a URL
 */
export async function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = url;
  });
}

/**
 * Crop and scale an image to a square format
 */
export async function cropImageToSquare(
  imageUrl: string,
  cropData: ImageCropData,
  outputSize: number = 512,
  quality: number = 0.92
): Promise<CroppedImageResult> {
  const img = await loadImage(imageUrl);

  // Create canvas for output
  const canvas = document.createElement('canvas');
  canvas.width = outputSize;
  canvas.height = outputSize;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Calculate scaled image dimensions
  const scaledWidth = img.naturalWidth * cropData.scale;
  const scaledHeight = img.naturalHeight * cropData.scale;

  // Clear canvas with transparent background
  ctx.clearRect(0, 0, outputSize, outputSize);

  // Draw the cropped and scaled portion of the image
  ctx.drawImage(
    img,
    // Source rectangle (from original image)
    0,
    0,
    img.naturalWidth,
    img.naturalHeight,
    // Destination rectangle (on canvas, accounting for position and scale)
    cropData.x,
    cropData.y,
    scaledWidth,
    scaledHeight
  );

  // Convert canvas to blob
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      b => {
        if (b) resolve(b);
        else reject(new Error('Failed to create blob'));
      },
      'image/png',
      quality
    );
  });

  // Create data URL
  const dataUrl = canvas.toDataURL('image/png', quality);

  // Create file
  const file = new File([blob], 'avatar.png', { type: 'image/png' });

  return { blob, dataUrl, file };
}

/**
 * Validate image file
 */
export function validateImageFile(
  file: File,
  maxSize: number = 10 * 1024 * 1024, // 10MB default
  allowedTypes: string[] = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif'
  ]
): { valid: boolean; error?: string } {
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`
    };
  }

  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `File too large. Maximum size: ${maxSizeMB}MB`
    };
  }

  return { valid: true };
}

/**
 * Calculate initial crop position to center the image
 */
export function calculateInitialCropData(
  imageWidth: number,
  imageHeight: number,
  containerSize: number
): ImageCropData {
  // Use Math.min to ensure the image covers the entire container (no gaps)
  const initialScale = containerSize / Math.min(imageWidth, imageHeight);

  const scaledWidth = imageWidth * initialScale;
  const scaledHeight = imageHeight * initialScale;

  const x = (containerSize - scaledWidth) / 2;
  const y = (containerSize - scaledHeight) / 2;

  return {
    x,
    y,
    scale: initialScale,
    width: imageWidth,
    height: imageHeight
  };
}

/**
 * Constrain position to keep image within bounds
 */
export function constrainPosition(
  x: number,
  y: number,
  imageWidth: number,
  imageHeight: number,
  scale: number,
  containerSize: number
): { x: number; y: number } {
  const scaledWidth = imageWidth * scale;
  const scaledHeight = imageHeight * scale;

  // Don't allow image to move beyond container bounds
  const maxX = 0;
  const minX = containerSize - scaledWidth;
  const maxY = 0;
  const minY = containerSize - scaledHeight;

  const constrainedX = Math.max(minX, Math.min(maxX, x));
  const constrainedY = Math.max(minY, Math.min(maxY, y));

  return { x: constrainedX, y: constrainedY };
}

/**
 * Calculate scale limits
 */
export function calculateScaleLimits(
  imageWidth: number,
  imageHeight: number,
  containerSize: number
): { min: number; max: number } {
  // Minimum scale: image must cover the entire container
  const minScale = containerSize / Math.min(imageWidth, imageHeight);

  // Maximum scale: allow up to 3x zoom
  const maxScale = minScale * 3;

  return { min: minScale, max: maxScale };
}
