import { conversationDirectRepository } from '@/db/repositories/conversation-direct.repository';
import { router } from 'expo-router';

export const navgateToChat = async (
  {
    userId,
    avatar,
    firstName,
    lastName,
  }: {
    userId: string;
    avatar: string | null;
    firstName: string;
    lastName: string;
  },
  shouldDismissToMain: boolean = true
) => {
  const existingCoversationWithUser = await conversationDirectRepository.getByUserId(userId);

  console.log(existingCoversationWithUser);

  if (existingCoversationWithUser) {
    router.replace({
      pathname: '/(main)/chat/direct/[id]',
      params: {
        id: existingCoversationWithUser.id,
        userId: existingCoversationWithUser.userId,
      },
    });
    return;
  }

  router.replace({
    pathname: '/(main)/chat/new/direct/[id]',
    params: {
      id: userId,
      name: firstName,
    },
  });
};
