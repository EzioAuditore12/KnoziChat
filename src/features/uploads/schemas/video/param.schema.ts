import { type } from 'arktype';

export const uploadVideoParamSchema = type({
  fileName: 'string',
  mimeType: 'string',
});

export type UploadVideoParam = typeof uploadVideoParamSchema.infer;
