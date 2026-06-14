import { router } from 'expo-router';
import { aiRepository } from '@/db/repositories/ai.repository';
import type { ChatOption } from '@/features/ai/components/input/types';

export const handleCreateAiChat = async (chat: ChatOption, onSuccess?: () => void) => {
  // Insert a welcome message to seed the conversation and make it show up in the list
  await aiRepository.create({
    text: 'Hi! I am ready to help you analyze this conversation.',
    sender: 'ai',
    conversationId: chat.id,
  });

  if (onSuccess) {
    onSuccess();
  }

  router.push({
    pathname: '/(main)/chat/ai/[id]',
    params: {
      id: chat.id,
      name: chat.name || 'Chat',
      isGroup: chat.type === 'group' ? 'true' : 'false',
      avatar: chat.avatar || '',
    },
  });
};
