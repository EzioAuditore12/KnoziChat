import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-arktype';

import { SnowFlakeId } from '@/lib/snowflake';

const AI_TABLE_NAME = 'ai';

export const aiTable = sqliteTable(AI_TABLE_NAME, {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => new SnowFlakeId(1).generate().toString()),
  conversationId: text('conversation_id').notNull(),
  sender: text('sender', { enum: ['ai', 'human'] }).notNull(),
  text: text('text').notNull(),
  createdAt: integer('created_at')
    .$defaultFn(() => Date.now())
    .notNull(),
  updatedAt: integer('updated_at')
    .$onUpdate(() => Date.now())
    .notNull(),
});

export const aiSchema = createSelectSchema(aiTable);
export const aiInsertSchema = createInsertSchema(aiTable);
export const aiUpdateSchema = createUpdateSchema(aiTable);

export type Ai = typeof aiSchema.infer;
export type AiInsert = typeof aiInsertSchema.infer;
export type AiUpdate = typeof aiUpdateSchema.infer;
