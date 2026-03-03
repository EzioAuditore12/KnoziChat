import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createSelectSchema, createInsertSchema } from 'drizzle-arktype';
import { SnowFlakeId } from '@/lib/snowflake';
import { relations } from 'drizzle-orm';
import { conversationOneToOneTable } from '@/db/tables/conversation-one-to-one.table';

export const CHAT_ONE_TO_ONE_TABLE_NAME = 'chat_one_to_one';

export const chatOneToOneTable = sqliteTable(
  CHAT_ONE_TO_ONE_TABLE_NAME,
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => new SnowFlakeId(1).generate().toString()),
    conversationId: text('conversation_id')
      .notNull()
      .references(() => conversationOneToOneTable.id, { onDelete: 'cascade' }),
    text: text('text', { length: 2000 }).notNull(),
    mode: text('mode', { enum: ['SENT', 'RECEIVED'] }).notNull(),
    status: text('status', { enum: ['SENT', 'DELIVERED', 'SEEN'] }).notNull(),
    createdAt: integer('created_at')
      .$defaultFn(() => Date.now())
      .notNull(),
    updatedAt: integer('updated_at')
      .$onUpdate(() => Date.now())
      .notNull(),
  },
  (t) => [index('conversation_one_to_one_idx').on(t.conversationId)]
);

export const chatOneToOneRelationWithConversationOneToOne = relations(
  chatOneToOneTable,
  ({ one }) => ({
    conversation: one(conversationOneToOneTable, {
      fields: [chatOneToOneTable.conversationId],
      references: [conversationOneToOneTable.id],
    }),
  })
);

export const selectChatOneToOneSchema = createSelectSchema(chatOneToOneTable);
export const insertChatOneToOneSchema = createInsertSchema(chatOneToOneTable);

export type ChatOneToOne = typeof selectChatOneToOneSchema.infer;
export type InsertChatOneToOne = typeof insertChatOneToOneSchema.infer;
