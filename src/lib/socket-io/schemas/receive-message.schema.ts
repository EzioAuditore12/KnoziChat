import { type } from 'arktype';

export const receiveMessageSchema = type({
  id: 'string',
  conversationId: 'string',
  senderId: 'string.uuid',
  receiverId: 'string.uuid',
  content: '0 < string < 1000 | null',
  contentType: '"file" | "text" | "image" | "video"',
  attachmentUrl: 'string.url | null',
  status: "'SENT' |'DELIVERED' | 'SEEN'",
  createdAt: 'Date',
  updatedAt: 'Date',
  deletedAt: 'Date | null',
});

export type ReceiveMessage = typeof receiveMessageSchema.infer;
