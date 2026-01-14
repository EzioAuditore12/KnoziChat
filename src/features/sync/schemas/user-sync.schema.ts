import { type } from 'arktype';

import { phoneSchema } from '@/lib/schemas';

export const userSyncSchema = type({
  id: 'string',
  first_name: '0 < string <=50',
  middle_name: '0 < string <= 50 | null',
  last_name: '0 < string <= 50',
  phone_number: phoneSchema,
  email: 'string.email | null',
  avatar: 'string.url | null',
  created_at: 'number',
  updated_at: 'number',
});

export type UserSync = typeof userSyncSchema.infer;
