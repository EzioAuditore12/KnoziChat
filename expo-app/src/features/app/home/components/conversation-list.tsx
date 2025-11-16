import type { ComponentProps } from 'react';
import { LegendList } from '@legendapp/list';
import { withObservables } from '@nozbe/watermelondb/react';

import { database } from '@/db';
import { Conversation } from '@/db/models/conversation.model';
import { CONVERSATION_TABLE_NAME } from '@/db/tables/conversation.table';

import { EnhancedConversationCard as ConversationCard } from './conversation-card';
import { router } from 'expo-router';

export type ConversationListProps = Omit<
  ComponentProps<typeof LegendList<Conversation>>,
  'data' | 'children' | 'keyExtractor' | 'renderItem'
> & {
  data: Conversation[];
};

const enhance = withObservables([], () => ({
  data: database.get<Conversation>(CONVERSATION_TABLE_NAME).query().observe(),
}));

function ConversationList({
  className,
  data,
  ...props
}: ConversationListProps) {
  return (
    <LegendList<Conversation>
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ConversationCard
          onPress={() =>
            router.push({
              pathname: '/(app)/chat/[id]',
              params: {
                id: item.id,
              },
            })
          }
          data={item}
          className="mb-3"
        />
      )}
      {...props}
    />
  );
}

export const EnhancedConversationList = enhance(ConversationList);
