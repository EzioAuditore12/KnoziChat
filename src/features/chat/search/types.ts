export type ChatSearchResult = {
  id: string;
  conversationId: string;
  name: string;
  updatedAt: number;
  type: 'direct' | 'group';
  userId: string | null;
  lastMessage: string | null;
};
