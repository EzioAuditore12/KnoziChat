import { router, useLocalSearchParams } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Description } from 'heroui-native/description';
import { Separator } from 'heroui-native/separator';
import { useAuthStore } from '@/store/auth';

import { ChatProfileHeader } from '@/features/chat/components/one-to-one/profile/header';
import { CommonGroupCard } from '@/features/chat/components/one-to-one/profile/commone-group-card';

import { useLiveUserDetails } from '@/features/chat/hooks/database/use-live-user-details';
import { useLiveUserProfileGroupInCommon } from '@/features/chat/hooks/database/use-live-user-profile-group-in-common';

export default function ChatProfileScreen() {
  const safeAreaInsets = useSafeAreaInsets();

  const { id } = useLocalSearchParams() as {
    id: string;
  };
  const currentUserId = useAuthStore((state) => state.user?.id!);

  const { data, isLoading } = useLiveUserDetails(id);

  const { data: commonGroups, isLoading: isCommonGroupsLoading } = useLiveUserProfileGroupInCommon({
    id,
    currentUserId,
  });

  if (isLoading || isCommonGroupsLoading)
    return (
      <View className="flex-1 items-center justify-center">
        <Description className="text-2xl font-bold">Loading the profile</Description>
      </View>
    );

  const user = data?.[0];

  return (
    <FlashList
      data={commonGroups}
      contentContainerStyle={{
        paddingBottom: safeAreaInsets.bottom,
      }}
      ItemSeparatorComponent={() => <Separator />}
      ListHeaderComponent={
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
      }
      renderItem={({ item }) => (
        <CommonGroupCard
          className="mx-4 my-1"
          data={item}
          onPress={() =>
            router.push({
              pathname: '/(main)/chat-group/[id]',
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
