import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-arktype';
import { relations, sql } from 'drizzle-orm';

import { SnowFlakeId } from '@/lib/snowflake';
import { chatGroupTable } from './chat-group.table';

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

export const conversationGroupRelationWithChatGroup = relations(
  conversationGroupTable,
  ({ many }) => ({
    chatsGroup: many(chatGroupTable),
  })
);

export const selectConversationGroupSchema = createSelectSchema(conversationGroupTable);
export const insertConversationGroupSchema = createInsertSchema(conversationGroupTable);
export const updateConversationGroupSchema = createUpdateSchema(conversationGroupTable);

export type ConversationGroup = typeof selectConversationGroupSchema.infer;
export type InsertConversationGroup = typeof insertConversationGroupSchema.infer;
export type UpdateConversationGroup = typeof updateConversationGroupSchema.infer;
