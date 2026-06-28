import { DrizzleAppSchema } from '@powersync/drizzle-driver';
import { OPSqliteOpenFactory } from '@powersync/op-sqlite';
import { PowerSyncDatabase } from '@powersync/react-native';

export const createPowerSyncDatabase = (dbName: string, schema: DrizzleAppSchema<any>) => {
  const factory = new OPSqliteOpenFactory({
    dbFilename: dbName,
  });

  return new PowerSyncDatabase({
    schema,
    database: factory,
  });
};
