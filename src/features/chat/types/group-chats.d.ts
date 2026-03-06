export type ChatGroupWithUserDetails = {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string | null;
  text: string;
  mode: 'SENT' | 'RECEIVED';
  createdAt: number;
  updatedAt: number;
};
