import { type } from 'arktype';

import { userSyncSchema } from '../user-sync.schema';

export const usersChangeSchema = type({
  created: userSyncSchema.array(),
  updated: userSyncSchema.array(),
  deleted: 'string[]',
});

export type UsersChange = typeof usersChangeSchema.infer;
