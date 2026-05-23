import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-arktype';

import { conversationGroupTable } from './conversation-group.table';
import { userTable } from './user.table';

export const conversationGroupMemberTable = sqliteTable(
  'conversation_group_member',
  {
    id: text('id').primaryKey(),

    groupId: text('group_id')
      .notNull()
      .references(() => conversationGroupTable.id, {
        onDelete: 'cascade',
      }),

    userId: text('user_id')
      .notNull()
      .references(() => userTable.id, {
        onDelete: 'cascade',
      }),

    isAdmin: integer('is_admin', {
      mode: 'boolean',
    })
      .notNull()
      .default(false),

    createdAt: integer('created_at')
      .$defaultFn(() => Date.now())
      .notNull(),

    updatedAt: integer('updated_at')
      .$onUpdate(() => Date.now())
      .notNull(),

    deletedAt: integer('deleted_at'),
  },
  (t) => [
    index('conversation_group_member_group_id_idx').on(t.groupId),

    index('conversation_group_member_user_id_idx').on(t.userId),
  ]
);

export const conversationGroupMemberSchema = createSelectSchema(conversationGroupMemberTable);
export const insertconversationGroupMemberSchema = createInsertSchema(conversationGroupMemberTable);

export type ConversationGroupMember = typeof conversationGroupMemberSchema.infer;
export type InsertConversationGroupMember = typeof insertconversationGroupMemberSchema.infer;
