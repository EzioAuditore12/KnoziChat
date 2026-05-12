import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-arktype';
import { sql } from 'drizzle-orm';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { SnowFlakeId } from '@/lib/snowflake';

import { conversationGroupTable } from './conversation-group.table';
import { userTable } from './user.table';

export const CHAT_GROUP_TABLE_NAME = 'chat_group';

export const chatGroupTable = sqliteTable(
  CHAT_GROUP_TABLE_NAME,
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => new SnowFlakeId(1).generate().toString()),
    conversationId: text('conversation_id')
      .notNull()
      .references(() => conversationGroupTable.id, { onDelete: 'cascade' }),
    senderId: text('sender_id')
      .notNull()
      .references(() => userTable.id),
    text: text('text', { length: 2000 }).notNull(),
    deliveredTo: text('delivered_to', { mode: 'json' })
      .$type<string[]>()
      .notNull()
      .default(sql`'[]'`),
    seenBy: text('seen_by', { mode: 'json' })
      .$type<string[]>()
      .notNull()
      .default(sql`'[]'`),
    createdAt: integer('created_at')
      .$defaultFn(() => Date.now())
      .notNull(),
    updatedAt: integer('updated_at')
      .$onUpdate(() => Date.now())
      .notNull(),
  },
  (t) => [index('conversation_group_idx').on(t.conversationId), index('sender_idx').on(t.senderId)]
);

export const chatGroupSchema = createSelectSchema(chatGroupTable);
export const insertChatGroupSchema = createInsertSchema(chatGroupTable);
export const updateChatGroupSchema = createUpdateSchema(chatGroupTable);

export type ChatGroup = typeof chatGroupSchema.infer;
export type InsertChatGroup = typeof insertChatGroupSchema.infer;
export type UpdateChatGroup = typeof updateChatGroupSchema.infer;
