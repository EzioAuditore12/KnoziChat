import { type } from 'arktype';

import { phoneSchema } from '@/lib/schemas';

export const userSchema = type({
  id: 'string.uuid',
  username: '0 < string <= 30',
  firstName: '0 < string <= 50',
  middleName: 'string <= 50 | null',
  lastName: '0 < string <= 50',
  phoneNumber: phoneSchema.or('null'),
  email: 'string.email',
  avatar: 'string.url | null',
  createdAt: 'string.date.iso',
  updatedAt: 'string.date.iso',
});

export type User = typeof userSchema.infer;
