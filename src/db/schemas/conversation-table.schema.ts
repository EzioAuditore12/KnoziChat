import { createTableSchemaWithSync } from './sync-metadata.schema';

export const CONVERSATION_TABLE_NAME = 'conversations';

export const ConversationTable = createTableSchemaWithSync(CONVERSATION_TABLE_NAME, [
  { name: 'contact', type: 'string' },
  { name: 'user_id', type: 'string' },
  { name: 'created_at', type: 'number' },
  { name: 'updated_at', type: 'number' },
]);
