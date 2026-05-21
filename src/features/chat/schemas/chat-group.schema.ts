import { type } from 'arktype';

export const chatGroupSchema = type({
  id: 'string',
  conversationId: 'string',
  senderId: 'string',
  contentType: "'image' | 'video' | 'text' | 'file' | 'system'",
  content: 'string | null',
  systemEventType:
    "'member_left' | 'member_joined' | 'admin_changed' | 'group_name_changed' | 'group_avatar_changed' | 'group_created' | null",
  metadata: 'Record<string, unknown> | null',
  attachmentUrl: 'string.url | null',
  deletedBy: 'string | null',
  createdAt: 'string.date.iso',
  updatedAt: 'string.date.iso',
  deletedAt: 'string.date.iso | null',
});

export type ChatGroup = typeof chatGroupSchema.infer;
