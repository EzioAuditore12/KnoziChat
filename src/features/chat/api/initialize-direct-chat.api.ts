import { authenticatedTypedFetch } from '@/lib/auth-fetch';

import type { InitializeDirectChatParam } from '../schemas/initialize-direct-chat/param.schema';
import { initializeDirectChatResponseSchema } from '../schemas/initialize-direct-chat/response.schema';

export const initializeDirectChatApi = async (data: InitializeDirectChatParam) => {
  const { receiverId, ...rest } = data;

  return await authenticatedTypedFetch({
    url: `chat/${receiverId}`,
    method: 'POST',
    body: rest,
    schema: initializeDirectChatResponseSchema,
  });
};
