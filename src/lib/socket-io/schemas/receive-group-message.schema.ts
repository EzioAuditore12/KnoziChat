import { type } from 'arktype';

export const receiveGroupMessageSchema = type({
  id: 'string',
  conversationId: 'string',
  senderId: 'string.uuid',
  contentType: '"file" | "text" | "image" | "video"',
  content: 'string | null',
  attachmentUrl: 'string | null',
  deletedBy: 'string | null | undefined',
  createdAt: 'string.date.iso',
  updatedAt: 'string.date.iso',
  deletedAt: 'string.date.iso | null | undefined',
});

export type ReceiveGroupMessage = typeof receiveGroupMessageSchema.infer;
