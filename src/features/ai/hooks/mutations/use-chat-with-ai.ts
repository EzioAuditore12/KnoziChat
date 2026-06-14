import { useMutation } from '@tanstack/react-query';

import { aiRepository } from '@/db/repositories/ai.repository';
import { askAiApi } from '../../api/ask-ai.api';

export function useChatWithAi() {
  return useMutation({
    mutationFn: askAiApi,
    onSuccess: async (data, variables) => {
      console.log(data);

      await aiRepository.create({
        text: data.response,
        sender: 'ai',
        conversationId: variables.group.groupId,
      });
    },
    onError: (error) => {
      alert(error);
    },
  });
}
