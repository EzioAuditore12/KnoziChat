import { type } from 'arktype';

export const sendGroupMessageSchema = type({
  id: 'string',
  conversationId: 'string',
  text: '0 < string <=1000',
  createdAt: 'Date',
  updatedAt: 'Date',
});

export type SendGroupMessage = typeof sendGroupMessageSchema.infer;
