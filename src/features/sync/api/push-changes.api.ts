import { authenticatedTypedFetch } from '@/lib/auth.api';
import type { PushChangeParam } from '../schemas/push-changes/param.schema';

import { pushChangeResponse } from '../schemas/push-changes/response.schema';

export const pushChangesApi = async (changes: PushChangeParam) => {
  return await authenticatedTypedFetch({
    url: `sync/push`,
    method: 'POST',
    body: changes,
    schema: pushChangeResponse,
  });
};
