import { type } from 'arktype';

export const authorizeDownloadResponseSchema = type({
  allowed: 'boolean',
  downloadUrl: 'string.url',
  fileType: "'image'| 'video' | 'file'",
  size: 'number',
});

export type AuthorizeDownloadResponse = typeof authorizeDownloadResponseSchema.infer;
