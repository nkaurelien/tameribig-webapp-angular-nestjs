export enum MediaType {
  Image = 'image',
  Video = 'video',
  Audio = 'audio',
}

export enum MediaStatus {
  Draft = 'draft',
  Published = 'published',
  Archived = 'archived',
}

export interface MediaAuthor {
  userId: string;
  displayName?: string;
  photoUrl?: string;
}

export interface MediaMetrics {
  views: number;
  upvotes: number;
  downloads: number;
}

export interface Media {
  _id?: string;
  type: 'media';
  mediaType: MediaType;
  status: MediaStatus;
  title: string;
  description?: string;
  keywords: string[];
  topics: string[];
  author: MediaAuthor;
  storage: {
    key: string;
    bucket: string;
    originalName: string;
    mimeType: string;
    size: number;
  };
  urls: {
    original: string;
    thumbnail?: string;
    preview?: string;
  };
  dimensions?: {
    width: number;
    height: number;
  };
  metrics: MediaMetrics;
  price?: number;
  createdAt: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface PublicMedia {
  _id?: string;
  title: string;
  description?: string;
  mediaType: MediaType;
  keywords: string[];
  topics: string[];
  author: MediaAuthor;
  urls: {
    thumbnail?: string;
    preview?: string;
  };
  dimensions?: {
    width: number;
    height: number;
  };
  metrics: MediaMetrics;
  price?: number;
  createdAt: string;
}
