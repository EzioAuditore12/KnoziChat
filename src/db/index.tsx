import { OPSqliteOpenFactory } from '@powersync/op-sqlite';
import { PowerSyncDatabase, PowerSyncContext, usePowerSync } from '@powersync/react-native';
import { wrapPowerSyncWithDrizzle } from '@powersync/drizzle-driver';
import type { PropsWithChildren } from 'react';

import { AppSchema, drizzleSchema } from './schema';

const dbName = 'knozichat.db';
const factory = new OPSqliteOpenFactory({ dbFilename: dbName });

export const powerSyncDb = new PowerSyncDatabase({
  schema: AppSchema,
  database: factory,
});

export const db = wrapPowerSyncWithDrizzle(powerSyncDb, {
  schema: drizzleSchema,
});

export function PowerSyncDatabaseProvider({ children }: PropsWithChildren) {
  return <PowerSyncContext.Provider value={powerSyncDb}>{children}</PowerSyncContext.Provider>;
}

export { usePowerSync };
