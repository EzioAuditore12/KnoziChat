import { type } from 'arktype';

import { phoneSchema } from '@/lib/schemas';

export const registerFormResponseSchema = type({
  status: 'string',
  message: 'string',
  phoneNumber: phoneSchema,
  duration: 'number',
});

export type RegisterFormResponse = typeof registerFormResponseSchema.infer;
