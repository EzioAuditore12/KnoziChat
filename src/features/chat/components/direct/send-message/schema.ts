import { type } from 'arktype';
import { fileSchema } from '@/features/common/schemas/file.schema';

export const sendMessageSchema = type({
  text: 'string <= 1000',
  'file?': fileSchema.or('undefined'),
}).narrow((data, ctx) => {
  const isEmptyText = data.text === '' || data.text === undefined;
  if (isEmptyText && data.file === undefined) {
    ctx.reject({
      expected: 'message or file required',
      actual: '',
    });
  }
  return true;
});

export type SendMessageSchemaType = typeof sendMessageSchema.infer;
