import type { DrizzleAppSchema } from '@powersync/drizzle-driver';
import { PowerSyncDatabase as PowerSyncDatabaseWeb, WASQLiteOpenFactory } from '@powersync/web';

export const createPowerSyncDatabase = (dbName: string, schema: DrizzleAppSchema<any>) => {
  const factory = new WASQLiteOpenFactory({
    dbFilename: dbName,
    worker: '/@powersync/worker/WASQLiteDB.umd.js',
  });

  return new PowerSyncDatabaseWeb({
    schema,
    database: factory,
    sync: {
      worker: '/@powersync/worker/SharedSyncImplementation.umd.js',
    },
  });
};
