import { typedFetch } from '@/lib/fetch';

import { env } from '@/env';
import { groupDetailsSchema } from '../schemas/group-details.schema';

export const getGroupDetailsApi = async (id: string) => {
  return await typedFetch({
    url: `${env.API_URL}/chat/group/${id}`,
    method: 'GET',
    schema: groupDetailsSchema,
  });
};
