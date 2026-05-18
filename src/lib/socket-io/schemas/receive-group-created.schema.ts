import { type } from 'arktype';

export const receiveGroupCreatedSchema = type({
  id: 'string',
  name: 'string',
  avatar: 'string.url | null',
  adminIds: 'string[]',
  participantIds: 'string[]',
  createdAt: 'string.date.iso',
  updatedAt: 'string.date.iso',
});

export type ReceiveGroupCreated = typeof receiveGroupCreatedSchema.infer;
