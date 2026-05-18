import { type } from 'arktype';
import { groupDetailsSchema } from '../group-details.schema';

export const initializeGroupChatResponseSchema = groupDetailsSchema.and(
  type({
    adminIds: 'string.uuid[]',
    participantIds: 'string.uuid[]',
  })
);

export type InitializeGroupChatResponse = typeof initializeGroupChatResponseSchema.infer;
