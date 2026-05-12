import { createInsertSchema, createSelectSchema } from 'drizzle-arktype';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { SnowFlakeId } from '@/lib/snowflake';

import { User, USER_TABLE_NAME, userTable } from './user.table';

export const CONVERSATION_DIRECT_TABLE_NAME = 'conversation_direct';

export const conversationDirectTable = sqliteTable(
  CONVERSATION_DIRECT_TABLE_NAME,
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => new SnowFlakeId(1).generate().toString()),
    userId: text('user_id')
      .unique()
      .notNull()
      .references(() => userTable.id),
    createdAt: integer('created_at')
      .$defaultFn(() => Date.now())
      .notNull(),
    updatedAt: integer('updated_at')
      .$onUpdate(() => Date.now())
      .notNull(),
  },
  (t) => [index('user_id_idx').on(t.userId)]
);

export const conversationDirectSchema = createSelectSchema(conversationDirectTable);

export const insertConversationDirectSchema = createInsertSchema(conversationDirectTable);

export type ConversationDirect = typeof conversationDirectSchema.infer;
export type InsertConversationDirect = typeof insertConversationDirectSchema.infer;

export type ConversationDirectJoinWithUser = {
  [CONVERSATION_DIRECT_TABLE_NAME]: ConversationDirect;
  [USER_TABLE_NAME]: User | null;
};
