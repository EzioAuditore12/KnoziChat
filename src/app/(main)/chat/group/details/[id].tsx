import { FlashList } from '@shopify/flash-list';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuthStore } from '@/store/auth';

import { Center } from '@/components/ui/center';
import { Divider } from '@/components/ui/divider';
import { Heading } from '@/components/ui/heading';

import { ChatGroupDetailsHeader } from '@/features/chat/components/group/details/header';
import { GroupMemberCard } from '@/features/chat/components/group/details/member-card';

import { useLiveGroupConversationDetails } from '@/features/chat/hooks/database/use-live-group-conversation-details';
import { useLiveGroupConversationMembers } from '@/features/chat/hooks/database/use-live-group-conversation-members';

export default function ChatGroupDetails() {
  const safeAreaInsets = useSafeAreaInsets();

  const { id } = useLocalSearchParams() as { id: string };

  const currentUserId = useAuthStore((state) => state.user?.id!);

  const { data, isLoading } = useLiveGroupConversationDetails(id);

  const { data: members, isLoading: isMembersLoading } = useLiveGroupConversationMembers({
    id,
    currentUserId,
    pageSize: 10,
  });

  if (isLoading || isMembersLoading)
    return (
      <Center className="flex-1">
        <Heading>Loading the details</Heading>
      </Center>
    );

  return (
    <FlashList
      data={members}
      contentContainerStyle={{
        paddingBottom: safeAreaInsets.bottom,
      }}
      ItemSeparatorComponent={() => <Divider />}
      ListHeaderComponent={
        <ChatGroupDetailsHeader
          style={{ paddingTop: safeAreaInsets.top + 20 }}
          className="items-center px-5"
          data={{
            avatar: data[0].avatar,
            membersLength: members.length,
            name: data[0].name,
            createdAt: new Date(data[0].createdAt),
            updatedAt: new Date(data[0].updatedAt),
          }}
        />
      }
      renderItem={({ item }) => <GroupMemberCard data={item} />}
    />
  );
}
