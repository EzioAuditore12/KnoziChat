import { type } from 'arktype';

import { phoneSchema } from '@/lib/schemas';

export const registerFormResponseSchema = type({
  status: 'string',
  message: 'string',
  email: '0 < string.email <=240',
  duration: 'number',
});

export type RegisterFormResponse = typeof registerFormResponseSchema.infer;
