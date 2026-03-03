import { db } from '@/db';

import { userTable } from './tables/user.table';
import { conversationOneToOneTable } from './tables/conversation-one-to-one.table';
import { chatOneToOneTable } from './tables/chat-one-to-one.table';

export async function pullChanges() {
  await db.transaction(async (transaction) => {
    const user = await transaction
      .insert(userTable)
      .values({
        firstName: 'Aman',
        lastName: 'Bisht',
        phoneNumber: '+916398322319',
        email: 'aman@gmail.com',
      })
      .returning()
      .get();

    const conversation = await transaction
      .insert(conversationOneToOneTable)
      .values({
        userId: user.id,
      })
      .returning()
      .get();

    await transaction.insert(chatOneToOneTable).values({
      conversationId: conversation.id,
      mode: 'SENT',
      status: 'SENT',
      text: 'Hello',
    });
  });
}
