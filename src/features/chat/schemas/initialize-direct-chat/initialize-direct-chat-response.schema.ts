import { type } from 'arktype';

import { objectIdSchema } from '@/lib/schemas';

export const initializeDirectChatResponseSchema = type({
  conversationId: objectIdSchema,
  senderId: 'string.uuid',
  receiverId: 'string.uuid',
  text: '0 < string <= 1000',
  delivered: 'boolean',
  seen: 'boolean',
  _id: objectIdSchema,
  createdAt: 'string.date.iso',
  updatedAt: 'string.date.iso',
  __v: 'number',
});

export type InitializeDirectChatResponse = typeof initializeDirectChatResponseSchema.infer;
