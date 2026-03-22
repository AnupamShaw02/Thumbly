export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Thumbnail {
  _id: string;
  userId: string;
  imageUrl: string;
  promptData: PromptData;
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

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export interface GenerateFormData {
  title: string;
  style: ThumbnailStyle;
  aspectRatio: AspectRatio;
  colorScheme: ColorScheme;
  additionalDetails: string;
}
