import { createInsertSchema, createSelectSchema } from 'drizzle-arktype';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { conversationDirectTable } from '@/db/tables/conversation-direct.table';

import { SnowFlakeId } from '@/lib/snowflake';

export const CHAT_DIRECT_TABLE_NAME = 'chat_direct';

export const chatDirectTable = sqliteTable(
  CHAT_DIRECT_TABLE_NAME,
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => new SnowFlakeId(1).generate().toString()),

    conversationId: text('conversation_id')
      .notNull()
      .references(() => conversationDirectTable.id, { onDelete: 'cascade' }),

    contentType: text('content_type', { enum: ['image', 'video', 'text', 'file'] }).notNull(),

    content: text('content'),

    mode: text('mode', { enum: ['SENT', 'RECEIVED'] }).notNull(),

    status: text('status', { enum: ['SENT', 'DELIVERED', 'SEEN'] }).notNull(),

    createdAt: integer('created_at')
      .$defaultFn(() => Date.now())
      .notNull(),

    updatedAt: integer('updated_at')
      .$onUpdate(() => Date.now())
      .notNull(),

    deletedAt: integer('deleted_at'),
  },
  (t) => [index('conversation_direct_idx').on(t.conversationId)]
);

export const chatDirectSchema = createSelectSchema(chatDirectTable);
export const insertChatDirectSchema = createInsertSchema(chatDirectTable);

export type ChatDirect = typeof chatDirectSchema.infer;
export type InsertChatDirect = typeof insertChatDirectSchema.infer;
