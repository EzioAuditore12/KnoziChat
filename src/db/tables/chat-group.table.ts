import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-arktype';
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

    contentType: text('content_type', { enum: ['image', 'video', 'text', 'file'] }).notNull(),

    content: text('content'),

    deletedBy: text('deleted_by'),

    createdAt: integer('created_at')
      .$defaultFn(() => Date.now())
      .notNull(),

    updatedAt: integer('updated_at')
      .$onUpdate(() => Date.now())
      .notNull(),

    deletedAt: integer('deleted_at'),
  },
  (t) => [
    index('chat_group_conversation_group_idx').on(t.conversationId),

    index('chat_group_sender_idx').on(t.senderId),
  ]
);

export const chatGroupSchema = createSelectSchema(chatGroupTable);
export const insertChatGroupSchema = createInsertSchema(chatGroupTable);
export const updateChatGroupSchema = createUpdateSchema(chatGroupTable);

export type ChatGroup = typeof chatGroupSchema.infer;
export type InsertChatGroup = typeof insertChatGroupSchema.infer;
export type UpdateChatGroup = typeof updateChatGroupSchema.infer;
