import { type } from 'arktype';

import { chatSchema } from '../chat.schema';

export const initializeDirectChatResponseSchema = type({
  status: 'string',
  message: 'string',
  data: chatSchema,
});

export type InitializeDirectChatResponse = typeof initializeDirectChatResponseSchema.infer;
