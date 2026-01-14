import { type } from 'arktype';

import { objectIdSchema } from '@/lib/schemas';

export const directChatSyncSchema = type({
  id: 'string',
  conversation_id: objectIdSchema,
  text: '0 < string <= 1000',
  mode: "'SENT' | 'RECEIVED'",
  is_delivered: 'boolean',
  is_seen: 'boolean',
  created_at: 'number',
  updated_at: 'number',
});

export type DirectChatSync = typeof directChatSyncSchema.infer;
