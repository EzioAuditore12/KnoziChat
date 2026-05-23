import { type } from 'arktype';

export const receiveGroupMessageSchema = type({
  id: 'string',
  conversationId: 'string',
  senderId: 'string',
  contentType: '"file" | "image" | "video" | "text" | "system"',
  content: 'string | null',
  systemEventType:
    '"member_left" | "member_joined" | "admin_changed" | "group_name_changed" | "group_avatar_changed" | "group_created" | null',
  metadata: 'Record<string, unknown> | null',
  status: "'DELIVERED' | 'SEEN'",
  attachmentUrl: 'string | null',
  createdAt: 'string.date.iso',
  updatedAt: 'string.date.iso',
  deletedBy: 'string | null | undefined',
  deletedAt: 'string | null | undefined',
});

export type ReceiveGroupMessage = typeof receiveGroupMessageSchema.infer;
