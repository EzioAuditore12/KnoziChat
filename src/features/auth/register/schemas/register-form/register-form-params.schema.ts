import { type } from 'arktype';

import { phoneSchema, strongPasswordSchema } from '@/lib/schemas';

export const registerFormParamSchema = type({
  firstName: '0 < string <= 50',
  middleName: type.string.atMostLength(50).optional(),
  lastName: '0 < string <= 50',
  email: type.string.atMostLength(240).optional(), // TODO: Need to find alternative for this to also add email validation
  phoneNumber: phoneSchema,
  password: strongPasswordSchema,
  confirmPassword: 'string',
  expoPushToken: 'string?',
}).narrow((data, ctx) => {
  if (data.password === data.confirmPassword) return true;

  return ctx.reject({
    expected: 'indentical to password',
    actual: '',
    path: ['confirmPassword'],
  });
});

export type RegisterFormParam = typeof registerFormParamSchema.infer;
