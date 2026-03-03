import { authenticatedTypedFetch } from '@/lib/auth.api';

import type { PullChangesParam } from '../schemas/pull-changes/param.schema';
import { pullChangesResponseSchema } from '../schemas/pull-changes/response.schema';

export const pullChangesApi = async (data: PullChangesParam) => {
  return await authenticatedTypedFetch({
    url: `sync/pull`,
    body: data,
    method: 'POST',
    schema: pullChangesResponseSchema,
  });
};
