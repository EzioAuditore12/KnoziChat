import crypto from 'react-native-nitro-crypto';

import { Socket } from '@/lib/socket-io';

import { Collection, Model } from '@nozbe/watermelondb';
import { SyncOperation } from '@/db/types';
import { DIRECT_CHAT_TABLE_NAME } from '@/db/schemas/direct-chat-table.schema';
import { DirectChat } from '@/db/models/direct-chat.model';
import { DirectChatRepository } from '@/db/repositories/direct-chat';

export interface SendMessageEvent {
  socket: Socket;
  /*execute: <T extends Model>(
    tableName: string,
    operation: SyncOperation,
    fn: (collection: any) => Promise<T>
  ) => Promise<T>;*/
  conversationId: string;
  text: string;
}

const directChatRepository = new DirectChatRepository();

export const sendMessageEvent = async ({ conversationId, text, socket }: SendMessageEvent) => {
  /*
  const saveDirectChat = await execute(
    DIRECT_CHAT_TABLE_NAME,
    SyncOperation.CREATE,
    async (collection: Collection<DirectChat>) => {
      const newMessage = await collection.create((chat: DirectChat) => {
        chat._setRaw('id', crypto.randomUUID());
        chat._setRaw('conversation_id', conversationId);
        chat.text = text;
        chat.mode = 'SENT';
        chat.createdAt = new Date();
        chat.updatedAt = new Date();
        chat.isDelivered = false;
        chat.isSeen = false;
      });
      return newMessage;
    }
  );*/

  const saveDirectChat = await directChatRepository.create({
    id: crypto.randomUUID(),
    conversationId,
    isDelivered: false,
    isSeen: false,
    mode: 'SENT',
    text,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  socket.emit('message:send', {
    conversationId: saveDirectChat._getRaw('conversation_id') as string,
    text: saveDirectChat.text,
    createdAt: saveDirectChat.createdAt,
    updatedAt: saveDirectChat.updatedAt,
  });
};
