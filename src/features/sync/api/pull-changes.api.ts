import { authenticatedTypedFetch } from '@/lib/auth.api';

import type { PullChangesParam } from '../schemas/pull-changes/param.schema';
import { pullChangesResponseSchema } from '../schemas/pull-changes/response.schema';

export const pullChangesApi = async ({ lastSyncAt, tables }: PullChangesParam) => {
  console.log(lastSyncAt);

  if (lastSyncAt === null || lastSyncAt === undefined) lastSyncAt = 0;

  return await authenticatedTypedFetch({
    url: `sync/pull`,
    body: { lastSyncAt, tables },
    method: 'POST',
    schema: pullChangesResponseSchema,
  });
};
