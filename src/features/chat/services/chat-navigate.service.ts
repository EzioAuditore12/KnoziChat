import { router } from 'expo-router';

import { ConversationRepository } from '@/db/repositories/conversation';

const conversationRepository = new ConversationRepository();

export const navigateToChat = async (receiverId: string, receiverName: string) => {};
