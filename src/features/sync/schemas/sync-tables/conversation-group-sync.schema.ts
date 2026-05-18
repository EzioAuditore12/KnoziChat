import { type } from 'arktype';

export const conversationGroupSyncSchema = type({
  id: 'string',
  name: 'string',
  avatar: 'string.url | null',
  createdAt: 'number',
  updatedAt: 'number',
});

export type ConversationGroupSync = typeof conversationGroupSyncSchema.infer;
