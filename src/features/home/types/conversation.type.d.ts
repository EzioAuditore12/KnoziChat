export type ConversationType = 'direct' | 'group';

export type Conversation = {
  id: string;
  name: string;
  avatar: string | null;
  updatedAt: number;
  type: ConversationType;
  userId: string;
  lastMessage: string | null;
  unreadCount: number;
};
