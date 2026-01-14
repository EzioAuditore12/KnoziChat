import { type } from 'arktype';

export const tableNamesSyncSchema = type("'conversations' | 'direct_chats' | 'users'");

export type TableNamesSync = typeof tableNamesSyncSchema.infer;
