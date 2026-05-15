import { type } from 'arktype';

export const authorizeUploadParamSchema = type({
  fileName: 'string',
  mimeType: 'string',
});

export type AuthroizeUploadParam = typeof authorizeUploadParamSchema.infer;
