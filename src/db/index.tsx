import { OPSqliteOpenFactory } from '@powersync/op-sqlite';
import { PowerSyncDatabase, PowerSyncContext, usePowerSync } from '@powersync/react-native';
import { wrapPowerSyncWithDrizzle } from '@powersync/drizzle-driver';
import { PropsWithChildren } from 'react';
import { AppSchema, drizzleSchema } from './schema';
import { setupFts } from './extensions/fts-5';
import { getOrGenerateDbKey } from './extensions/sql-cipher';

const dbName = 'knozichat.db';

// Dummy function to extract exact ReturnType for typescript without instantiating early
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _getDb = () => wrapPowerSyncWithDrizzle({} as PowerSyncDatabase, { schema: drizzleSchema });

export let powerSyncDb: PowerSyncDatabase;
let _dbInstance: ReturnType<typeof _getDb>;

export const setupDatabase = () => {
  if (powerSyncDb) return;

  const encryptionKey = getOrGenerateDbKey();

  const factory = new OPSqliteOpenFactory({
    dbFilename: dbName,
    sqliteOptions: {
      encryptionKey,
    },
  });

  powerSyncDb = new PowerSyncDatabase({
    schema: AppSchema,
    database: factory,
  });

  _dbInstance = wrapPowerSyncWithDrizzle(powerSyncDb, {
    schema: drizzleSchema,
  });

  // Run FTS setup asynchronously so it doesn't block the app startup
  setupFts(_dbInstance).catch(console.error);
};

// Call it immediately at the top level
setupDatabase();

export const db = _dbInstance!;

export function PowerSyncDatabaseProvider({ children }: PropsWithChildren) {
  return <PowerSyncContext.Provider value={powerSyncDb}>{children}</PowerSyncContext.Provider>;
}

export { usePowerSync };
export type DbType = typeof db | Parameters<Parameters<typeof db.transaction>[0]>[0];
