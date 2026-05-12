export type ConversationType = 'direct' | 'group';

export type Conversation = {
  id: string;
  name: string;
  updatedAt: number;
  type: ConversationType;
  userId: string;
  lastMessage: string | null;
};
