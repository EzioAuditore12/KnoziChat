import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';

import { initializeDirectChatApi } from '../api/initialize-direct-chat.api';
import { getUserApi } from '../../user/api/get-user.api';

import { UserRepository } from '../../user/repositories/user.repository';
import { DirectChatRepository } from '../repositories/direct-chat.repository';
import { ConversationRepository } from '../repositories/conversation.repository';

export const useInitializeDirectChat = () => {
  const userRepository = new UserRepository();
  const conversationRespository = new ConversationRepository();
  const directChatRepository = new DirectChatRepository();

  return useMutation({
    mutationFn: initializeDirectChatApi,
    onSuccess: async (data) => {
      const receiverDetails = await getUserApi(data.data.receiverId);

      const savedReceiver = await userRepository.create(receiverDetails);

      const savedConversation = await conversationRespository.create({
        contact: savedReceiver.firstName,
        userId: savedReceiver.id,
        createdAt: new Date(data.data.createdAt),
        updatedAt: new Date(data.data.createdAt),
      });

      await directChatRepository.create({
        _id: data.data._id,
        conversationId: savedConversation.id,
        isDelivered: false,
        isSeen: false,
        mode: 'SENT',
        text: data.data.text,
        createdAt: new Date(data.data.createdAt),
        updatedAt: new Date(data.data.createdAt),
      });

      router.replace({
        pathname: '/(app)/chat/[id]',
        params: {
          id: savedReceiver.id,
        },
      });
    },
    onError: (error) => {
      alert(`${error.message}`);
    },
  });
};
