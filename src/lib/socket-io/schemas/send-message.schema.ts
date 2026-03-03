import { type } from 'arktype';

export const sendMessageSchema = type({
  id: 'string',
  conversationId: 'string',
  receiverId: 'string.uuid',
  text: '0 < string < 1000',
  status: "'SENT' |'DELIVERED' | 'SEEN'",
  createdAt: 'Date',
  updatedAt: 'Date',
});

export type SendMessage = typeof sendMessageSchema.infer;
