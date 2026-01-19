import { database } from '@/db';

import { Conversation } from '@/db/models/conversation.model';
import { CONVERSATION_TABLE_NAME } from '@/db/schemas/conversation-table.schema';

import type { CreateConversationDto } from './types/create-conversation';

export class ConversationRepository {
  async create(createConversationDto: CreateConversationDto) {
    return await database.write(async () => {
      return await database.get<Conversation>(CONVERSATION_TABLE_NAME).create((conversation) => {
        conversation._setRaw('user_id', createConversationDto.userId);

        if (createConversationDto.createdAt !== undefined)
          conversation.createdAt = new Date(createConversationDto.createdAt);

        if (createConversationDto.updatedAt !== undefined)
          conversation.updatedAt = new Date(createConversationDto.updatedAt);
      });
    });
  }

  async get() {
    return await database.get<Conversation>(CONVERSATION_TABLE_NAME).query().fetch();
  }

  async getConversationsWithUsers() {
    const conversations = await this.get();
    return Promise.all(
      conversations.map(async (conv) => ({
        ...conv,
        user: await conv.user,
      }))
    );
  }
}
