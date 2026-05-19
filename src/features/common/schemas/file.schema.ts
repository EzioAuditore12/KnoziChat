import { type } from 'arktype';

export const fileSchema = type({
  uri: 'string',
  name: 'string',
  type: 'string',
  size: 'number',
  contentType: "'image' | 'file' | 'video'",
});

export type File = typeof fileSchema.infer;
