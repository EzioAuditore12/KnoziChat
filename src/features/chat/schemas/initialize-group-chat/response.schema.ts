import { type } from 'arktype';

export const initializeGroupChatResponseSchema = type({
  id: 'string',
  name: '0 < string <= 50',
  avatar: 'string | null',
  admins: 'string.uuid[]',
  participants: 'string.uuid[]',
  createdAt: 'string.date.iso',
  updatedAt: 'string.date.iso',
});

export type InitializeGroupChatResponse = typeof initializeGroupChatResponseSchema.infer;
