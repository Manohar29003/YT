export interface MediaItem {
  id: string;
  filename: string;
  type: 'video' | 'image';
  url: string;
  thumbnailUrl: string;
  duration?: string;
  size?: string;
  resolution?: string;
  isCustom?: boolean;
}

// Default media list cleared as requested - ready for user media uploads
export const MEDIA_ITEMS: MediaItem[] = [];
