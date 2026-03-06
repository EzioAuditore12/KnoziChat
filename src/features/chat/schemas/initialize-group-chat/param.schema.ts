import { type } from 'arktype';

export const initializeGroupChatParamSchema = type({
  name: '0 < string <= 50',
  participants: 'string.uuid[]',
});

export type InitializeGroupChatParam = typeof initializeGroupChatParamSchema.infer;
