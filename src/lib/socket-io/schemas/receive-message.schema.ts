import { type } from 'arktype';

export const receiveMessageSchema = type({
  id: 'string',
  conversationId: 'string',
  senderId: 'string.uuid',
  text: '0 < string < 1000',
  status: "'SENT' |'DELIVERED' | 'SEEN'",
  createdAt: 'Date',
  updatedAt: 'Date',
});

export type ReceiveMessage = typeof receiveMessageSchema.infer;
