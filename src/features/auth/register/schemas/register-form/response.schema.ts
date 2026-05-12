import { type } from 'arktype';

export const registerFormResponseSchema = type({
  status: 'string',
  message: 'string',
  email: '0 < string.email <=240',
  duration: 'number',
});

export type RegisterFormResponse = typeof registerFormResponseSchema.infer;
