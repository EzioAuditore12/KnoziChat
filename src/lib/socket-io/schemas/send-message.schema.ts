import { type } from 'arktype';

export const sendMessageSchema = type({
  id: 'string | undefined',
  conversationId: 'string',
  receiverId: 'string.uuid',
  contentType: '"file" | "text" | "image" | "video"',
  content: 'string | null',
  attachmentUrl: 'string | null',
  createdAt: 'Date | undefined',
  updatedAt: 'Date | undefined',
  deletedAt: 'Date | undefined',
});

export type SendMessage = typeof sendMessageSchema.infer;
