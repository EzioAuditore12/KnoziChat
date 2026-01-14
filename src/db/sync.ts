import { SyncEngine } from './core/sync-engine';
import { ConflictStrategy } from './types';

import { database } from '@/db';
import { apiClient } from './api.client';

import { CONVERSATION_TABLE_NAME } from './schemas/conversation-table.schema';
import { DIRECT_CHAT_TABLE_NAME } from './schemas/direct-chat-table.schema';
import { USER_TABLE_NAME } from './schemas/user-table.schema';

const syncEngine = new SyncEngine({
  database,
  enableBackgroundSync: true,
  syncOnReconnect: true,
  tables: [USER_TABLE_NAME, CONVERSATION_TABLE_NAME, DIRECT_CHAT_TABLE_NAME],
  apiClient,
  syncInterval: 5 * 60 * 1000, // 5 minutes
  conflictStrategy: ConflictStrategy.SERVER_WINS,
});

export async function initializeSyncEngine() {
  try {
    await syncEngine.initialize();
  } catch (error) {
    console.error('Failed to initialize sync engine:', error);
  }
}

export default syncEngine;
