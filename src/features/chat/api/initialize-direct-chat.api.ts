import { authenticatedTypedFetch } from '@/lib/auth.api';

import type { InitializeDirectChatParam } from '../schemas/initialize-direct-chat/initialize-direct-chat-param.schema';
import { initializeDirectChatResponseSchema } from '../schemas/initialize-direct-chat/initialize-direct-chat-response.schema';

export const initializeDirectChatApi = async (data: InitializeDirectChatParam) => {
  return await authenticatedTypedFetch({
    url: 'chat',
    method: 'POST',
    body: data,
    schema: initializeDirectChatResponseSchema,
  });
};
