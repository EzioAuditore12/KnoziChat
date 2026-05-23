import { type } from 'arktype';

export const chatGroupSyncSchema = type({
  id: 'string',
  conversationId: 'string',
  senderId: 'string.uuid',
  contentType: "'image' | 'video' | 'text' | 'file' | 'system'",
  content: 'string | null',
  systemEventType:
    "'member_left' | 'member_joined' |' admin_changed' | 'group_name_changed' | 'group_avatar_changed' | 'group_created' | null",
  metadata: 'Record<string, unknown> | null',
  status: "'DELIVERED' | 'SEEN'",
  createdAt: 'number',
  updatedAt: 'number',
  deletedAt: 'number | null',
  deletedBy: 'string.uuid | null',
});

export type ChatGroupSync = typeof chatGroupSyncSchema.infer;
