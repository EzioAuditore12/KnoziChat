import { type } from 'arktype';

export const uploadImageParamSchema = type({
  fileName: 'string',
  mimeType: 'string',
});

export type UploadImageParam = typeof uploadImageParamSchema.infer;
