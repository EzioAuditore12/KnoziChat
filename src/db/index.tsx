import { OPSqliteOpenFactory } from '@powersync/op-sqlite';
import { PowerSyncDatabase, PowerSyncContext, usePowerSync } from '@powersync/react-native';
import { wrapPowerSyncWithDrizzle } from '@powersync/drizzle-driver';
import type { PropsWithChildren } from 'react';

import { AppSchema, drizzleSchema } from './schema';
import { setupFts } from './extensions/fts-5';

const dbName = 'knozichat.db';
const factory = new OPSqliteOpenFactory({ dbFilename: dbName });

export const powerSyncDb = new PowerSyncDatabase({
  schema: AppSchema,
  database: factory,
});

export const db = wrapPowerSyncWithDrizzle(powerSyncDb, {
  schema: drizzleSchema,
});

setupFts(db).catch(console.error);

export function PowerSyncDatabaseProvider({ children }: PropsWithChildren) {
  return <PowerSyncContext.Provider value={powerSyncDb}>{children}</PowerSyncContext.Provider>;
}

export { usePowerSync };
export type DbType = typeof db | Parameters<Parameters<typeof db.transaction>[0]>[0];
