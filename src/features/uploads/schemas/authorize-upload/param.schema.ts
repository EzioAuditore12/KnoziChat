import { type } from 'arktype';

export const authorizeUploadParamSchema = type({
  fileName: 'string',
  mimeType: 'string',
});

export type AuthroizeUploadPram = typeof authorizeUploadParamSchema.infer;
