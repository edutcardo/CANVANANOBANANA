export enum AppStatus {
  IDLE,
  IMAGE_UPLOADED,
  GENERATING_STYLES,
  GENERATING_IMAGES,
  COMPLETE,
  ERROR,
}

export interface OriginalImage {
  file: File;
  base64: string; // The data URL for the original uploaded image
}

export interface GeneratedImage {
  id: number;
  src: string; // The data URL for the AI-generated image
  prompt: string;
}