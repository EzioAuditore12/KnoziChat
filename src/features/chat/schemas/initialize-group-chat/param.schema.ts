import { type } from 'arktype';

export const initializeGroupChatParamSchema = type({
  name: '0 < string <= 50',
  participants: 'string.uuid[]',
  avatar: type(
    type({
      uri: 'string',
      name: 'string',
      type: 'string',
    })
  ).or('undefined'),
});

export type InitializeGroupChatParam = typeof initializeGroupChatParamSchema.infer;
