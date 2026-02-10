import ObjectID from 'bson-objectid';

import { Socket } from '@/lib/socket-io';
import type { SendMessageDto } from '@/lib/socket-io/dto/message-send.dto';

import { DirectChatRepository } from '@/db/repositories/direct-chat';
import { ConversationRepository } from '@/db/repositories/conversation';

const directChatRepository = new DirectChatRepository();

const conversationRepository = new ConversationRepository();

export type SendMessageEvent = Omit<SendMessageDto, '_id' | 'createdAt' | 'updatedAt'> & {
  socket: Socket;
};

export const sendMessageEvent = async ({
  conversationId,
  text,
  receiverId,
  socket,
}: SendMessageEvent) => {
  const saveDirectChat = await directChatRepository.create({
    id: ObjectID().toHexString(),
    conversationId,
    isDelivered: false,
    isSeen: false,
    mode: 'SENT',
    text,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await conversationRepository.updateConversationTime(
    saveDirectChat._getRaw('conversation_id') as string,
    new Date()
  );

  socket.emit('message:send', {
    _id: saveDirectChat.id,
    conversationId: saveDirectChat._getRaw('conversation_id') as string,
    receiverId,
    text: saveDirectChat.text,
    createdAt: saveDirectChat.createdAt,
    updatedAt: saveDirectChat.updatedAt,
  });
};
