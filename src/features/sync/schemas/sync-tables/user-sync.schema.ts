import { type } from 'arktype';

export const userSyncSchema = type({
  id: 'string.uuid',
  firstName: 'string',
  middleName: 'string | null',
  lastName: 'string',
  avatar: 'string.url | null',
  phoneNumber: 'string | null',
  email: 'string.email',
  createdAt: 'number',
  updatedAt: 'number',
});

export type UserSync = typeof userSyncSchema.infer;
