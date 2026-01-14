import { type } from 'arktype';

import { conversationsChangeSchema } from '../changes/conversations-change.schema';
import { directChatChangeSchema } from '../changes/direct-chats-change.schema';
import { usersChangeSchema } from '../changes/users-change.schema';

export const pullChangesResponseSchema = type({
  timestamp: 'number',
  changes: {
    users: usersChangeSchema,
    conversations: conversationsChangeSchema,
    direct_chats: directChatChangeSchema,
  },
});

export type PullChangesResponse = typeof pullChangesResponseSchema.infer;
