import { authenticatedTypedFetch } from '@/lib/auth.api';

import type { InitializeGroupChatParam } from '../schemas/initialize-group-chat/param.schema';
import { initializeGroupChatResponseSchema } from '../schemas/initialize-group-chat/response.schema';

export const initializeGroupChatApi = async (data: InitializeGroupChatParam) => {
  return await authenticatedTypedFetch({
    url: 'chat/group',
    method: 'POST',
    body: data,
    schema: initializeGroupChatResponseSchema,
  });
};
