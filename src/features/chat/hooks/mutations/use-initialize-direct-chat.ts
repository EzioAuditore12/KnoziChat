import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';

import { getUserApi } from '@/features/common/api/get-user.api';
import { initializeDirectChatApi } from '../../api/initialize-direct-chat.api';

import { UserRepository } from '@/db/repositories/user';
import { ConversationRepository } from '@/db/repositories/conversation';
import { DirectChatRepository } from '@/db/repositories/direct-chat';

const userRepository = new UserRepository();
const conversationRespository = new ConversationRepository();
const directChatRepository = new DirectChatRepository();

export const useInitializeDirectChat = () => {
  return useMutation({
    mutationFn: initializeDirectChatApi,
    onSuccess: async (data) => {
      const receiverDetails = await getUserApi(data.receiverId);

      const savedReceiver = await userRepository.create({
        ...receiverDetails,
        createdAt: new Date(receiverDetails.createdAt),
        updatedAt: new Date(receiverDetails.updatedAt),
      });

      const savedConversation = await conversationRespository.create({
        id: data.conversationId,
        userId: savedReceiver.id,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      });

      await directChatRepository.create({
        id: data._id,
        conversationId: savedConversation.id,
        isDelivered: false,
        isSeen: false,
        mode: 'SENT',
        text: data.text,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      });

      router.replace({
        pathname: '/(main)/chat/[id]',
        params: {
          id: savedConversation.id,
          userId: savedConversation._getRaw('user_id') as string,
        },
      });
    },
    onError: (error) => {
      console.log(error.message);
      alert(`${error.message}`);
    },
  });
};
