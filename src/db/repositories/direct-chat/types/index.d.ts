export type CreateDirectChatDto = {
  id?: string;
  conversationId: string;
  text: string;
  mode: 'SENT' | 'RECEIVED';
  isDelivered: boolean;
  isSeen: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
