import { FlashList } from '@shopify/flash-list';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Center } from '@/components/ui/center';
import { Divider } from '@/components/ui/divider';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';

import { useAuthStore } from '@/store/auth';

import { CommonGroupCard } from '@/features/chat/components/direct/profile/common-group-card';
import { ChatProfileHeader } from '@/features/chat/components/direct/profile/header';

import { useLiveUserDetails } from '@/features/chat/hooks/database/use-live-user-details';
import { useLiveUserProfileGroupInCommon } from '@/features/chat/hooks/database/use-live-user-profile-group-in-common';
import { useLiveGetDirectChatMedia } from '@/features/chat/hooks/database/use-live-get-direct-chat-media';
import { RecentMediaList } from '@/features/chat/components/recent-media-list';

export default function ChatProfileScreen() {
  const safeAreaInsets = useSafeAreaInsets();

  const { id, chatId } = useLocalSearchParams() as {
    id: string;
    chatId: string;
  };
  const currentUserId = useAuthStore((state) => state.user?.id!);

  const { data, isLoading } = useLiveUserDetails(id);

  const { data: commonGroups, isLoading: isCommonGroupsLoading } = useLiveUserProfileGroupInCommon({
    id,
    currentUserId,
  });

  const { data: recentMedia } = useLiveGetDirectChatMedia({
    id: chatId,
    pageSize: 10,
  });

  console.log(recentMedia);

  if (isLoading || isCommonGroupsLoading)
    return (
      <Center className="flex-1">
        <Heading>Loading user details</Heading>
      </Center>
    );

  const user = data?.[0];

  return (
    <FlashList
      data={commonGroups}
      contentContainerStyle={{
        paddingBottom: safeAreaInsets.bottom,
      }}
      ItemSeparatorComponent={() => <Divider />}
      ListHeaderComponent={
        <>
          <ChatProfileHeader
            style={{
              paddingTop: safeAreaInsets.top + 20,
            }}
            className="items-center px-5"
            data={{
              avatar: user?.avatar,
              firstName: user?.firstName,
              lastName: user?.lastName,
              commonGroupsLength: commonGroups.length,
            }}
          />
          <RecentMediaList id={chatId} media={recentMedia} type="direct" />
          <Text size="lg" className="mt-8 px-5 font-semibold">
            Groups In Common
          </Text>
        </>
      }
      renderItem={({ item }) => (
        <CommonGroupCard
          className="mx-4 my-1"
          data={item}
          onPress={() =>
            router.push({
              pathname: '/(main)/chat/group/[id]',
              params: {
                id: item.id,
              },
            })
          }
        />
      )}
    />
  );
}
