import { DrizzleAppSchema } from '@powersync/drizzle-driver';

import { userTable } from './tables/user.table';

export const drizzleSchema = {
  userTable,
};

export const AppSchema = new DrizzleAppSchema(drizzleSchema);
