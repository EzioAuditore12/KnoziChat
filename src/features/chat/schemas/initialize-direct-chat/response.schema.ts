import { type } from 'arktype';

export const initializeDirectChatResponseSchema = type({
  id: 'string',
  conversationId: 'string',
  senderId: 'string.uuid',
  receiverId: 'string.uuid',
  content: '0 < string <= 1000 | null',
  contentType: "'image'| 'video' | 'text'|'file'",
  lastSeenAt: 'Record<string, number>',
  attachmentUrl: 'string.url | null',
  status: "'SENT' | 'DELIVERED' | 'SEEN'",
  deletedAt: 'string.date.iso | null',
  createdAt: 'string.date.iso',
  updatedAt: 'string.date.iso',
});

export type InitializeDirectChatResponse = typeof initializeDirectChatResponseSchema.infer;
