import type { ComponentProps } from 'react';
import { LegendList } from '@legendapp/list';
import { withObservables } from '@nozbe/watermelondb/react';
import { Q } from '@nozbe/watermelondb';

import { database } from '@/db';
import { DirectChat } from '@/db/models/direct-chat.model';
import { DIRECT_CHAT_TABLE_NAME } from '@/db/tables/direct-chat.table';

import { ChatText } from './chat-text';

export type DirectMessageListProps = Omit<
  ComponentProps<typeof LegendList<DirectChat>>,
  'data' | 'children' | 'keyExtractor' | 'renderItem'
> & {
  data: DirectChat[];
};

const enhance = withObservables(
  ['conversationId'],
  ({ conversationId }: { conversationId: string }) => ({
    data: database
      .get<DirectChat>(DIRECT_CHAT_TABLE_NAME)
      .query(Q.where('conversation_id', conversationId))
      .observe(),
  }),
);

function DirectMessageList({
  className,
  data,
  ...props
}: DirectMessageListProps) {
  return (
    <LegendList<DirectChat>
      className="mb-2"
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ChatText data={item} className="mb-3 min-w-16" />
      )}
      maintainScrollAtEnd
      maintainScrollAtEndThreshold={0.1}
      alignItemsAtEnd
      recycleItems
      {...props}
    />
  );
}

export const EnhancedDirectChatList = enhance(DirectMessageList);
