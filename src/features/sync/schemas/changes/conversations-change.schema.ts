import { type } from 'arktype';

import { conversationSyncSchema } from '../conversation-sync.schema';

export const conversationsChangeSchema = type({
  created: conversationSyncSchema.array(),
  updated: conversationSyncSchema.array(),
  deleted: 'string[]',
});

export type ConversationsChange = typeof conversationsChangeSchema.infer;
