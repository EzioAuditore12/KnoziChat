import { phoneSchema } from '@/lib/schemas';
import { type } from 'arktype';

export const loginParamSchema = type({
  phoneNumber: phoneSchema,
  password: '0 < string <= 16',
});

export type LoginParam = typeof loginParamSchema.infer;
