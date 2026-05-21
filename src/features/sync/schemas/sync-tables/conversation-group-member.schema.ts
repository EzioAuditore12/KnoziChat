import { type } from 'arktype';

export const conversationGroupMemberSyncSchema = type({
  id: 'string',
  groupId: 'string',
  userId: 'string.uuid',
  isAdmin: 'boolean',
  createdAt: 'number',
  updatedAt: 'number',
  deletedAt: 'number | null',
});

export type ConversationGroupMemberSync = typeof conversationGroupMemberSyncSchema.infer;
