import { type } from 'arktype';

import { phoneSchema, strongPasswordSchema } from '@/lib/schemas';

export const registerFormParamSchema = type({
  firstName: '0 < string <= 50',
  middleName: type('0 < string <= 50').or('undefined'),
  lastName: '0 < string <= 50',
  email: '0 < string.email <= 240',
  avatar: type(
    type({
      uri: 'string',
      name: 'string',
      type: 'string',
    })
  ).or('undefined'),
  phoneNumber: phoneSchema.or('null').or('undefined'),
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
