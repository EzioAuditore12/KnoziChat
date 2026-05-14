import { type } from 'arktype';

export const authorizeUploadResponseSchema = type({
  allowed: 'boolean',
  token: 'string',
  userId: 'string.uuid',
  projectId: 'string',
  endpoint: 'string',
  bucketId: 'string',
});

export type AuthorizeUploadResponse = typeof authorizeUploadResponseSchema.infer;
