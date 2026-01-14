import { type } from 'arktype';

import { directChatSyncSchema } from '../direct-chat-sync.schema';

export const directChatChangeSchema = type({
  created: directChatSyncSchema.array(),
  updated: directChatSyncSchema.array(),
  deleted: 'string[]',
});

export type DirectChatChange = typeof directChatChangeSchema.infer;
