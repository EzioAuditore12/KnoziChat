import { FlashList } from '@shopify/flash-list';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { desc, eq, sql } from 'drizzle-orm';

import { db } from '@/db';
import { conversationGroupMemberTable } from '@/db/tables/conversation-group-member.table';
import { userTable } from '@/db/tables/user.table';

import { Center } from '@/components/ui/center';
import { Divider } from '@/components/ui/divider';
import { Heading } from '@/components/ui/heading';

import { ChatGroupDetailsHeader } from '@/features/chat/components/group/details/header';
import { GroupMemberCard } from '@/features/chat/components/group/details/member-card';

import { useLiveGroupConversationDetails } from '@/features/chat/hooks/database/use-live-group-conversation-details';
import { useLiveInfiniteQuery } from '@/db/hooks/use-live-infinite-query';

import { useAuthStore } from '@/store/auth';
import { navgateToChat } from '@/features/chat/components/direct/utils/navigate-to-chat';

type GroupConversationMember = {
  id: string;
  name: string;
  lastName: string;
  userId: string;
  isAdmin: boolean;
  avatar: string | null;
  isMe: boolean;
};

export default function ChatGroupDetails() {
  const safeAreaInsets = useSafeAreaInsets();

  const { id } = useLocalSearchParams() as { id: string };

  const currentUserId = useAuthStore((state) => state.user?.id ?? '');

  const { data: groupDetails, isLoading } = useLiveGroupConversationDetails(id);

  const { data: members, isLoading: isMembersLoading } = useLiveInfiniteQuery({
    query: db
      .select({
        id: conversationGroupMemberTable.id,
        userId: conversationGroupMemberTable.userId,
        name: userTable.firstName,
        lastName: userTable.lastName,
        isAdmin: conversationGroupMemberTable.isAdmin,
        avatar: userTable.avatar,
        isMe: sql<boolean>`${conversationGroupMemberTable.userId} = ${currentUserId}`.as('isMe'),
      })
      .from(conversationGroupMemberTable)
      .innerJoin(userTable, eq(conversationGroupMemberTable.userId, userTable.id))
      .where(eq(conversationGroupMemberTable.groupId, id))
      .orderBy(desc(conversationGroupMemberTable.isAdmin), userTable.firstName),
    pageSize: 10,
  });

  if (isLoading || isMembersLoading)
    return (
      <Center className="flex-1">
        <Heading>Loading the details</Heading>
      </Center>
    );

  return (
    <FlashList<GroupConversationMember>
      data={members ?? []}
      contentContainerStyle={{
        paddingBottom: safeAreaInsets.bottom,
      }}
      ItemSeparatorComponent={() => <Divider />}
      ListHeaderComponent={
        <ChatGroupDetailsHeader
          style={{ paddingTop: safeAreaInsets.top + 20 }}
          className="items-center px-5"
          data={{
            avatar: groupDetails.avatar,
            membersLength: members.length,
            name: groupDetails.name,
            createdAt: new Date(groupDetails.createdAt),
            updatedAt: new Date(groupDetails.updatedAt),
          }}
        />
      }
      renderItem={({ item }) => (
        <GroupMemberCard
          data={item}
          onPress={() =>
            navgateToChat(
              {
                avatar: item.avatar,
                firstName: item.name,
                userId: item.userId,
                lastName: item.lastName,
              },
              false
            )
          }
        />
      )}
    />
  );
}
