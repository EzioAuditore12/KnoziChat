import { type } from 'arktype';

export const conversationDirectSyncSchema = type({
  id: 'string',
  userId: 'string.uuid',
  createdAt: 'number',
  updatedAt: 'number',
});

export type ConversationDirectSync = typeof conversationDirectSyncSchema.infer;
