import { type } from 'arktype';
import { groupDetailsSchema } from '../group-details.schema';
import { chatGroupSchema } from '../chat-group.schema';

export const initializeGroupChatResponseSchema = groupDetailsSchema.and(
  type({
    adminIds: 'string.uuid[]',
    participantIds: 'string.uuid[]',
    chat: chatGroupSchema,
  })
);

export type InitializeGroupChatResponse = typeof initializeGroupChatResponseSchema.infer;
