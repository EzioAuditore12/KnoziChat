import { database } from '@/db';

import { DirectChat } from '@/db/models/direct-chat.model';
import { DIRECT_CHAT_TABLE_NAME } from '@/db/schemas/direct-chat-table.schema';

import type { CreateDirectChatDto } from './types';

export class DirectChatRepository {
  async create(createDirectChatDto: CreateDirectChatDto) {
    return await database.write(async () => {
      return await database.get<DirectChat>(DIRECT_CHAT_TABLE_NAME).create((directChat) => {
        if (createDirectChatDto.id !== undefined) directChat._raw.id = createDirectChatDto.id;

        directChat._setRaw('conversation_id', createDirectChatDto.conversationId);

        directChat.text = createDirectChatDto.text;
        directChat.mode = createDirectChatDto.mode;
        directChat.isDelivered = createDirectChatDto.isDelivered;
        directChat.isSeen = createDirectChatDto.isSeen;

        if (createDirectChatDto.createdAt !== undefined)
          directChat.createdAt = createDirectChatDto.createdAt;

        if (createDirectChatDto.updatedAt !== undefined)
          directChat.updatedAt = createDirectChatDto.updatedAt;
      });
    });
  }

  async get() {
    return await database.get<DirectChat>(DIRECT_CHAT_TABLE_NAME).query().fetch();
  }
}
