import { OPSqliteOpenFactory } from '@powersync/op-sqlite';
import { PowerSyncDatabase, PowerSyncContext, usePowerSync } from '@powersync/react-native';
import { wrapPowerSyncWithDrizzle } from '@powersync/drizzle-driver';
import { PropsWithChildren, useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { AppSchema, drizzleSchema } from './schema';
import { setupFts } from './extensions/fts-5';
import { getOrGenerateDbKey } from './extensions/sql-cipher';

const dbName = 'knozichat.db';

// Dummy function to extract exact ReturnType for typescript without instantiating early
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _getDb = () => wrapPowerSyncWithDrizzle({} as PowerSyncDatabase, { schema: drizzleSchema });

export let powerSyncDb: PowerSyncDatabase;
let _dbInstance: ReturnType<typeof _getDb> | null = null;

// Proxy the db object so other files can safely capture it synchronously
// Any method calls (e.g. db.select()) will be forwarded to the real instance once it's initialized.
export const db = new Proxy({} as ReturnType<typeof _getDb>, {
  get(_target, prop) {
    if (!_dbInstance) {
      throw new Error(`Cannot access db.${String(prop)} before database is initialized.`);
    }
    const key = prop as keyof typeof _dbInstance;
    const val = _dbInstance[key];
    return typeof val === 'function' ? (val as Function).bind(_dbInstance) : val;
  },
});

export const setupDatabase = async () => {
  if (powerSyncDb) return;

  const encryptionKey = await getOrGenerateDbKey();

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

  await setupFts(_dbInstance).catch(console.error);
};

export function PowerSyncDatabaseProvider({ children }: PropsWithChildren) {
  const [isReady, setIsReady] = useState(!!powerSyncDb);

  useEffect(() => {
    if (!isReady) {
      setupDatabase()
        .then(() => setIsReady(true))
        .catch((e) => console.error('Failed to init DB:', e));
    } else {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return <PowerSyncContext.Provider value={powerSyncDb}>{children}</PowerSyncContext.Provider>;
}

export { usePowerSync };
export type DbType = typeof db | Parameters<Parameters<typeof db.transaction>[0]>[0];
