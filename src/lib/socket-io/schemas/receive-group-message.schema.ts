import { type } from 'arktype';

export const receiveGroupMessageSchema = type({
  id: 'string',
  conversationId: 'string',
  createdAt: 'Date',
  updatedAt: 'Date',
  senderId: 'string',
  text: 'string',
  deliveredTo: 'string.uuid[]',
  seenBy: 'string.uuid[]',
});

export type ReceiveGroupMessage = typeof receiveGroupMessageSchema.infer;
