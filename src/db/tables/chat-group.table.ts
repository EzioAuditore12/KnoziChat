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

    status: text('status', {
      enum: ['PENDING', 'DELIVERED', 'SEEN', 'FAILED'],
    }).notNull(),

    contentType: text('content_type', {
      enum: ['image', 'video', 'text', 'file', 'system'],
    }).notNull(),

    systemEventType: text('system_event_type', {
      enum: [
        'member_left',
        'member_joined',
        'admin_changed',
        'group_name_changed',
        'group_avatar_changed',
        'group_created',
      ],
    }),

    metadata: text('metadata', {
      mode: 'json',
    }).$type<Record<string, unknown> | null>(),

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
    index('chat_group_conv_created_idx').on(t.conversationId, t.createdAt),
  ]
);

export const chatGroupSchema = createSelectSchema(chatGroupTable);
export const insertChatGroupSchema = createInsertSchema(chatGroupTable);
export const updateChatGroupSchema = createUpdateSchema(chatGroupTable);

export type ChatGroup = typeof chatGroupSchema.infer;
export type InsertChatGroup = typeof insertChatGroupSchema.infer;
export type UpdateChatGroup = typeof updateChatGroupSchema.infer;
