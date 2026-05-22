import { type } from 'arktype';

const chats = type({
  username: 'string',
  message: 'string',
  created_at: 'string.date',
});

export const askAiParamSchema = type({
  group: {
    group_id: 'string.base64',
    group_name: 'string',
  },
  chats: chats.array(),
  query: 'string',
});

export type AskAiParam = typeof askAiParamSchema.infer;
