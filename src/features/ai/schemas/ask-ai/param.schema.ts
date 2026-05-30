import { type } from 'arktype';

const chats = type({
  username: 'string',
  message: 'string',
  createdAt: 'string.date',
});

export const askAiParamSchema = type({
  group: {
    groupId: 'string.base64',
    groupName: 'string',
  },
  chats: chats.array(),
  query: 'string',
});

export type AskAiParam = typeof askAiParamSchema.infer;
