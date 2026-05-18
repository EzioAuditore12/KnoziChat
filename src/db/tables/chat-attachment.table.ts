import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-arktype';

export const CHAT_ATTACHMENT_TABLE_NANE = 'chat_attachment';

export const chatAttachmentTable = sqliteTable(CHAT_ATTACHMENT_TABLE_NANE, {
  id: text('id').primaryKey(),

  localUri: text('local_uri'),

  remoteUrl: text('remote_url'),

  mimeType: text('mime_type'),

  fileName: text('file_name'),

  fileSize: integer('file_size'),

  width: integer('width'),

  height: integer('height'),

  duration: integer('duration'),

  thumbnailUri: text('thumbnail_uri'),

  uploadId: text('upload_id'),

  transferredBytes: integer('transferred_bytes').default(0).notNull(),

  totalBytes: integer('total_bytes'),

  transferType: text('transfer_type', {
    enum: ['UPLOAD', 'DOWNLOAD'],
  }).notNull(),

  transferStatus: text('transfer_status', {
    enum: ['PENDING', 'DOWNLOADING', 'PAUSED', 'COMPLETED', 'FAILED'],
  }).notNull(),

  updatedAt: integer('updated_at')
    .$onUpdate(() => Date.now())
    .notNull(),
});

export const chatAttachmentSchema = createSelectSchema(chatAttachmentTable);
export const insertChatAttachmentSchema = createInsertSchema(chatAttachmentTable);

export type ChatAttachment = typeof chatAttachmentSchema.infer;
export type InsertChatAttachment = typeof insertChatAttachmentSchema.infer;
