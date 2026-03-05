import { type } from 'arktype';

export const pullChangesParamSchema = type({
  lastSyncedAt: 'number',
  tableNames: type(
    "'CONVERSATION-ONE-TO-ONE' | 'CHAT-ONE-TO-ONE' | 'USER' | 'CONVERSATION-GROUP' | 'CHAT-GROUP'"
  ).array(),
});

export type PullChangesParam = typeof pullChangesParamSchema.infer;
