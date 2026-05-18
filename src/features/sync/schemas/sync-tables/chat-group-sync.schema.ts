import { type } from 'arktype';

export const chatGroupSyncSchema = type({
  id: 'string',
  conversationId: 'string',
  senderId: 'string.uuid',
  contentType: "'image' | 'video' | 'text' | 'file'",
  content: 'string | null',
  createdAt: 'number',
  updatedAt: 'number',
  deletedAt: 'number | null',
  deletedBy: 'string.uuid | null',
});

export type ChatGroupSync = typeof chatGroupSyncSchema.infer;
