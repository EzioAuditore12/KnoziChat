import { type } from 'arktype';

export const initializeDirectChatParamSchema = type({
  receiverId: 'string.uuid',
  text: '0 < string <= 1000',
});

export type InitializeDirectChatParam = typeof initializeDirectChatParamSchema.infer;
