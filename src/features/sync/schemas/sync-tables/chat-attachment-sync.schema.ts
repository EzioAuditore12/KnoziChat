import { type } from 'arktype';

export const chatAttachmentSyncSchema = type({
  id: 'string',
  remoteUrl: 'string.url | null',
});

export type ChatAttachmentSync = typeof chatAttachmentSyncSchema.infer;
