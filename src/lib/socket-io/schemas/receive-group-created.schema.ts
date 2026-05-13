import { type } from 'arktype';

export const receiveGroupCreatedSchema = type({
  id: 'string',
  createdAt: 'string.date.iso',
  updatedAt: 'string.date.iso',
  name: 'string',
  avatar: 'string | null',
  admins: 'string[]',
  participants: 'string[]',
});

export type ReceiveGroupCreated = typeof receiveGroupCreatedSchema.infer;
