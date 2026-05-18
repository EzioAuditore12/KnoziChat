import { type } from 'arktype';

export const sendGroupMessageSchema = type({
  id: 'string | undefined',
  createdAt: 'Date | undefined',
  updatedAt: 'Date | undefined',
  conversationId: 'string',
  contentType: '"file" | "text" | "image" | "video"',
  content: 'string | null',
  attachmentUrl: 'string.url | null',
  deletedAt: 'Date | undefined',
  deletedBy: 'string | null | undefined',
});

export type SendGroupMessage = typeof sendGroupMessageSchema.infer;
