export type ChatGroupWithUserDetails = {
  id: string;
  senderId: string;
  senderName: string | null;
  senderAvatar: string | null;
  content: string | null;
  contentType: 'text' | 'image' | 'video' | 'file';
  createdAt: number;
  updatedAt: number;
  mode: 'SENT' | 'RECEIVED';
};
