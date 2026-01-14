import { type } from 'arktype';
import { tableNamesSyncSchema } from '../table-names-sync.schema';

export const pullChangesParamSchema = type({
  lastSyncAt: 'number | null | undefined',
  tables: tableNamesSyncSchema.array(),
});

export type PullChangesParam = typeof pullChangesParamSchema.infer;
