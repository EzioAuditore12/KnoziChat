import { type } from 'arktype';

export const conversationDirectSyncSchema = type({
  id: 'string',
  userId: 'string.uuid',
  myLastSeenAt: 'number',
  theirLastSeenAt: 'number',
  createdAt: 'number',
  updatedAt: 'number',
});

export type ConversationDirectSync = typeof conversationDirectSyncSchema.infer;
