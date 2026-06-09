export interface ChatMediaItem {
  id: string;
  contentType: 'image' | 'video' | 'text' | 'file' | 'system';
  remoteUrl: string | null;
  localUri: string | null;
  thumbnailUri: string | null;
  status: 'PENDING' | 'DELIVERED' | 'SEEN' | 'FAILED';
  transferStatus: 'PENDING' | 'UPLOADING' | 'DOWNLOADING' | 'COMPLETED' | 'FAILED' | null;
  createdAt: number;
}
