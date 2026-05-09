import { phoneSchema } from '@/lib/schemas';
import { type } from 'arktype';

export const loginParamSchema = type({
  email: 'string.email',
  password: '0 < string <= 16',
  expoPushToken: 'string?',
});

export type LoginParam = typeof loginParamSchema.infer;
