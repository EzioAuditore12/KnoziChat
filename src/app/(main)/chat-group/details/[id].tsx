import { useLocalSearchParams } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'react-native';

import { Description } from 'heroui-native/description';
import { Separator } from 'heroui-native/separator';

import { useAuthStore } from '@/store/auth';

import { useLiveGroupConversationMembers } from '@/features/chat/hooks/database/use-live-group-conversation-members';
import { useLiveGroupConversationDetails } from '@/features/chat/hooks/database/use-live-group-conversation-details';
import { ChatGroupDetailsHeader } from '@/features/chat/components/group/details/header';
import { GroupMemberCard } from '@/features/chat/components/group/details/member-card';

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
      <View className="flex-1 items-center justify-center">
        <Description className="text-2xl font-bold">Loading the details</Description>
      </View>
    );

  return (
    <FlashList
      data={members}
      contentContainerStyle={{
        paddingBottom: safeAreaInsets.bottom,
      }}
      ItemSeparatorComponent={() => <Separator />}
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
