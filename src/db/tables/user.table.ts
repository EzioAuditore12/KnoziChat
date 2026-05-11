import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-arktype';
import crypto from 'react-native-nitro-crypto';
import { type } from 'arktype';

export const USER_TABLE_NAME = 'user';

export const userTable = sqliteTable(USER_TABLE_NAME, {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  phoneNumber: text('phone_number').unique(),
  email: text('email', { length: 240 }).unique().notNull(),
  avatar: text('avatar'),
  firstName: text('first_name', { length: 50 }).notNull(),
  middleName: text('middle_name', { length: 50 }),
  lastName: text('last_name', { length: 50 }).notNull(),
  createdAt: integer('created_at')
    .$defaultFn(() => Date.now())
    .notNull(),
  updatedAt: integer('updated_at')
    .$onUpdate(() => Date.now())
    .notNull(),
});

export const selectUserSchema = createSelectSchema(userTable, {
  id: type('string.uuid'),
  email: type('string.email'),
});

export const insertUserSchema = createInsertSchema(userTable, {
  id: type('string.uuid').optional(),
  email: type('string.email'),
});

export type User = typeof selectUserSchema.infer;
export type InsertUser = typeof insertUserSchema.infer;
