import { Database, type TableSchema } from '@nozbe/watermelondb';

import { createAdapter } from './adapter';
import { migrations } from './migrations';
import { createSchema } from './schema';

import { ConversationTable } from './schemas/conversation-table.schema';
import { DirectChatTable } from './schemas/direct-chat-table.schema';
import { syncQueueTableSchema } from './schemas/sync-queue-table.schema';
import { UserTable } from './schemas/user-table.schema';

import { Conversation } from './models/conversation.model';
import { DirectChat } from './models/direct-chat.model';
import { User } from './models/user.model';
import { SyncQueueItemModel } from './models/sync-queue-item.model';

const tables: TableSchema[] = [syncQueueTableSchema, UserTable, ConversationTable, DirectChatTable];

const models = [User, Conversation, DirectChat, SyncQueueItemModel];

const schema = createSchema(tables);

export const database = new Database({
  adapter: createAdapter(schema, migrations),
  modelClasses: models,
});
