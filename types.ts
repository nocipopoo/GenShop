export type AspectRatio = '9:16' | '3:4' | '4:3' | '16:9';

export enum CopyMode {
  MANUAL = 'MANUAL',
  AUTO_COPY = 'AUTO_COPY',
}

export interface AppState {
  mainCopy: string;
  subCopy: string;
  copyMode: CopyMode;
  aspectRatio: AspectRatio;
  productImage: string | null; // Base64
  referenceImage: string | null; // Base64
  customPrompt: string;
  selectedTag: string;
  generatedImage: string | null; // Base64 or URL
  isGenerating: boolean;
  isEditing: boolean;
  error: string | null;
}

export const CATEGORY_TAGS = [
  'Fashion (穿搭)',
  'Beauty (美妆)',
  'Food (美食)',
  'Sports (运动)',
  'Outdoor (户外)',
  'Baby (母婴)',
  'Digital (数码)',
  'Home (家居)',
];

// User types
export interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

// Generation record types
export interface GenerationParameters {
  mainCopy: string;
  subCopy: string;
  copyMode: CopyMode;
  aspectRatio: AspectRatio;
  selectedTag: string;
  customPrompt: string;
}

export interface GenerationRecord {
  id: string;
  user_id: string;
  image_url: string | null;
  video_url: string | null;
  parameters: GenerationParameters;
  created_at: string;
}
