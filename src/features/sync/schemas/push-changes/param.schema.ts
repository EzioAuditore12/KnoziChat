import { type } from 'arktype';

import { conversationSyncSchema } from '../conversation-sync.schema';
import { directChatSyncSchema } from '../direct-chat-sync.schema';
import { tableNamesSyncSchema } from '../table-names-sync.schema';
import { userSyncSchema } from '../user-sync.schema';

const changeSchema = type({
  tableName: tableNamesSyncSchema,
  operation: "'CREATE' | 'UPDATE' | 'DELETE'",
  recordId: 'string',
  data: conversationSyncSchema.or(directChatSyncSchema).or(userSyncSchema),
});

export const pushChangesParamSchema = type({
  changes: changeSchema.array(),
});

export type PushChangeParam = typeof pushChangesParamSchema.infer;
