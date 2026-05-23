import { authenticatedTypedFetch } from '@/lib/auth.api';

import type { InitializeGroupChatParam } from '../schemas/initialize-group-chat/param.schema';
import { initializeGroupChatResponseSchema } from '../schemas/initialize-group-chat/response.schema';

export const initializeGroupChatApi = async (data: InitializeGroupChatParam) => {
  const formData = new FormData();

  formData.append('name', data.name);

  if (data.avatar) {
    formData.append('avatar', {
      uri: data.avatar.uri,
      name: data.avatar.name,
      type: data.avatar.type,
    } as any);
  }

  formData.append('participants', JSON.stringify(data.participants));

  return await authenticatedTypedFetch({
    url: 'chat/group',
    method: 'POST',
    body: formData,
    schema: initializeGroupChatResponseSchema,
  });
};
