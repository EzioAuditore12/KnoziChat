import { type } from 'arktype';

export const chatDirectSyncSchema = type({
  id: 'string',
  conversationId: 'string',
  mode: "'SENT' | 'RECEIVED'",
  contentType: "'image' | 'video' | 'text' | 'file'",
  content: 'string | null',
  status: "'DELIVERED' | 'SEEN'",
  createdAt: 'number',
  updatedAt: 'number',
  deletedAt: 'number | null',
});

export type ChatDirectSync = typeof chatDirectSyncSchema.infer;
