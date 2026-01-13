import { createTableSchemaWithSync } from './sync-metadata.schema';

export const DIRECT_CHAT_TABLE_NAME = 'direct_chats';

export const DirectChatTable = createTableSchemaWithSync(DIRECT_CHAT_TABLE_NAME, [
  { name: 'conversation_id', type: 'string', isIndexed: true },
  { name: 'text', type: 'string' },
  { name: 'mode', type: 'string' },
  { name: 'is_delivered', type: 'boolean' },
  { name: 'is_seen', type: 'boolean' },
  { name: 'created_at', type: 'number' },
  { name: 'updated_at', type: 'number' },
]);
