import authenticatedAxiosInstance from '@/features/auth/common/api/auth.api';

import type { InitializeDirectChatParams } from '../schemas/initialize-direct-chat/initialize-direct-chat-params.schema';
import { initializeDirectChatResponseSchema } from '../schemas/initialize-direct-chat/initialize-direct-chat-response.schema';

export const initializeDirectChatApi = async (
  data: InitializeDirectChatParams,
) => {
  const response = await authenticatedAxiosInstance.post(
    `chat/direct/${data.receiverId}`,
    {
      text: data.text,
    },
  );

  const parsed = initializeDirectChatResponseSchema.safeParse(response.data);

  if (!parsed.success) {
    throw new Error(
      `Validation failed: ${JSON.stringify(parsed.error.message)}`,
    );
  }

  return parsed.data;
};
