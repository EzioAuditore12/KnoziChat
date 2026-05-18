import { type } from 'arktype';

export const initializeDirectChatParamSchema = type({
  id: 'string | null',
  receiverId: 'string.uuid',
  content: '0 < string <= 1000 | null',
  contentType: "'image'| 'video' | 'text'|'file'",
  attachmentUrl: 'string.url | null',
  createdAt: 'string.date.iso | null',
  updatedAt: 'string.date.iso | null',
});

export type InitializeDirectChatParam = typeof initializeDirectChatParamSchema.infer;
