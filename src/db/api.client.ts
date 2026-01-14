import type { ApiClient } from './types';

import { pullChangesApi } from '@/features/sync/api/pull-changes.api';
import { pushChangesApi } from '@/features/sync/api/push-changes.api';

import type { PushChangeParam } from '@/features/sync/schemas/push-changes/param.schema';
import type { TableNamesSync } from '@/features/sync/schemas/table-names-sync.schema';

export const apiClient: ApiClient = {
  pull: async (payload) => {
    console.log('Payload for pull is:');

    const { changes, timestamp } = await pullChangesApi({
      lastSyncAt: payload.lastSyncAt,
      tables: payload.tables as TableNamesSync[],
    });

    return { changes, timestamp };
  },
  push: async (payload) => {
    console.log(payload.changes);

    const { results, success } = await pushChangesApi(payload as PushChangeParam);

    return { results, success };
  },
};
