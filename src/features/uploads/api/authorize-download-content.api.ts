import { authenticatedTypedFetch } from '@/lib/auth.api';

import type { AuthorizeDownloadParam } from '../schemas/download/param.schema';
import { authorizeDownloadResponseSchema } from '../schemas/download/response.schema';

export const authorizeDownloadContentApi = async (data: AuthorizeDownloadParam) => {
  return await authenticatedTypedFetch({
    url: 'uploads/download',
    method: 'POST',
    body: data,
    schema: authorizeDownloadResponseSchema,
  });
};
