import { type } from 'arktype';

export const groupMemberSchema = type({
  id: 'string',
  groupId: 'string',
  userId: 'string.uuid',
  isAdmin: 'boolean',
  createdAt: 'string.date.iso',
  updatedAt: 'string.date.iso',
  deletedAt: 'string.date.iso | null',
});

export type GroupMember = typeof groupMemberSchema.infer;
