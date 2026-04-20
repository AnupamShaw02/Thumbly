export interface Thumbnail {
  _id: string;
  userId: string;
  imageUrl: string;
  promptData: PromptData;
  isPublic: boolean;
  likes: string[];
  createdAt: string;
}

export interface PromptData {
  title: string;
  style: ThumbnailStyle;
  aspectRatio: AspectRatio;
  colorScheme: ColorScheme;
  additionalDetails?: string;
}

export type ThumbnailStyle =
  | 'gaming'
  | 'vlog'
  | 'tech'
  | 'tutorial'
  | 'cinematic'
  | 'minimalist'
  | 'bold'
  | 'educational';

export type AspectRatio = '16:9' | '4:3' | '1:1' | '9:16';

export type ColorScheme =
  | 'vibrant'
  | 'dark'
  | 'light'
  | 'neon'
  | 'monochrome'
  | 'warm'
  | 'cool'
  | 'gradient';

export interface GenerateFormData {
  title: string;
  style: ThumbnailStyle;
  aspectRatio: AspectRatio;
  colorScheme: ColorScheme;
  additionalDetails: string;
}
