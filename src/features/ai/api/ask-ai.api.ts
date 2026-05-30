import { env } from '@/env';

import { authenticatedTypedFetch } from '@/lib/auth.api';
import { AskAiParam } from '../schemas/ask-ai/param.schema';
import { askAiResponseSchema } from '../schemas/ask-ai/response.schema';
import { aiRepository } from '@/db/repositories/ai.repository';
import { chatGroupRepository } from '@/db/repositories/chat-group.repository';

export const askAiApi = async (data: Omit<AskAiParam, 'chats'>) => {
  await aiRepository.create({ text: data.query, sender: 'human' });

  const groupChats = await chatGroupRepository.getAllWithUser(data.group.groupId);

  const mappedChats: AskAiParam['chats'] = groupChats
    .filter((chat) => chat.contentType === 'text' && chat.content !== null)
    .map((chat) => ({
      message: chat.content!,
      username: chat.user?.username!,
      createdAt: new Date(chat.createdAt).toISOString(),
    }));

  return await authenticatedTypedFetch({
    baseUrl: env.AI_URL,
    url: `send`,
    method: 'POST',
    body: { ...data, chats: mappedChats },
    schema: askAiResponseSchema,
  });
};
