import { type } from 'arktype';

export const groupMemberSchema = type({
  id: 'string',
  groupId: 'string',
  userId: 'string.uuid',
  isAdmin: 'boolean',
  joinedAt: 'string.date.iso',
});

export type GroupMember = typeof groupMemberSchema.infer;
