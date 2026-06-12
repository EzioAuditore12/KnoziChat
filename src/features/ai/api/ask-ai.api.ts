import { env } from '@/env';

import { authenticatedStreamingSseFetch } from '@/lib/auth-fetch';
import { AskAiParam } from '../schemas/ask-ai/param.schema';
import { aiRepository } from '@/db/repositories/ai.repository';

export type AskAiRequestData = Omit<AskAiParam, 'chats'> & {
  onMessage?: (text: string) => void;
  isGroup?: boolean;
};

export const askAiApi = async (data: AskAiRequestData) => {
  await aiRepository.create({ text: data.query, sender: 'human' });

  let fullResponse = '';

  await authenticatedStreamingSseFetch(
    {
      baseUrl: env.AI_URL,
      url: `send`,
      method: 'GET',
      query: {
        conversationId: data.group.groupId,
        isGroup: data.isGroup ?? false,
        query: data.query,
      },
    },
    (text) => {
      fullResponse += text;
      if (data.onMessage) {
        data.onMessage(text);
      }
    }
  );

  return { response: fullResponse };
};
