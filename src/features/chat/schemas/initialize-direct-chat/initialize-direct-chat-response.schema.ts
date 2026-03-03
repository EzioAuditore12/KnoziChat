import { type } from 'arktype';

export const initializeDirectChatResponseSchema = type({
  id: 'string',
  conversationId: 'string',
  senderId: 'string.uuid',
  receiverId: 'string.uuid',
  text: '0 < string <= 1000',
  createdAt: 'string.date.iso',
  updatedAt: 'string.date.iso',
});

export type InitializeDirectChatResponse = typeof initializeDirectChatResponseSchema.infer;
