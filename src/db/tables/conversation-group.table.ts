import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-arktype';
import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { type } from 'arktype';

import { SnowFlakeId } from '@/lib/snowflake';

export const CONVERSATION_GROUP_TABLE_NAME = 'conversation_group';

export const conversationGroupTable = sqliteTable(CONVERSATION_GROUP_TABLE_NAME, {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => new SnowFlakeId(1).generate().toString()),
  name: text('name').notNull(),
  avatar: text('avatar'),
  participantIds: text('participant_ids', { mode: 'json' })
    .$type<string[]>()
    .notNull()
    .default(sql`'[]'`),
  adminIds: text('admin_ids', { mode: 'json' })
    .$type<string[]>()
    .notNull()
    .default(sql`'[]'`),
  createdAt: integer('created_at')
    .$defaultFn(() => Date.now())
    .notNull(),
  updatedAt: integer('updated_at')
    .$onUpdate(() => Date.now())
    .notNull(),
});

export const conversationGroupSchema = createSelectSchema(conversationGroupTable, {
  participantIds: type('string.uuid[]'),
  adminIds: type('string.uuid[]'),
});
export const insertConversationGroupSchema = createInsertSchema(conversationGroupTable);
export const updateConversationGroupSchema = createUpdateSchema(conversationGroupTable);

export type ConversationGroup = typeof conversationGroupSchema.infer;
export type InsertConversationGroup = typeof insertConversationGroupSchema.infer;
export type UpdateConversationGroup = typeof updateConversationGroupSchema.infer;
