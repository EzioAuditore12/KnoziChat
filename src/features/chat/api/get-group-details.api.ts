import { typedFetch } from '@/lib/fetch';

import { initializeGroupChatResponseSchema } from '../schemas/initialize-group-chat/response.schema';
import { env } from '@/env';

export const getGroupDetailsApi = async (id: string) => {
  return await typedFetch({
    url: `${env.API_URL}/chat/group/${id}`,
    method: 'GET',
    schema: initializeGroupChatResponseSchema,
  });
};
