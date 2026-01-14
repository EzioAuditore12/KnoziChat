import { type } from 'arktype';

export const conversationSyncSchema = type({
  id: 'string',
  user_id: 'string.uuid',
  created_at: 'number',
  updated_at: 'number',
});

export type ConversationSync = typeof conversationSyncSchema.infer;
