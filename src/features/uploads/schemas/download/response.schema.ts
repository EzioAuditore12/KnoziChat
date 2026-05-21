import { type } from 'arktype';

export const authorizeDownloadResponseSchema = type({
  allowed: 'boolean',
  downloadUrl: 'string.url',
  fileType: "'image'| 'video' | 'file'",
});

export type AuthorizeDownloadResponse = typeof authorizeDownloadResponseSchema.infer;
