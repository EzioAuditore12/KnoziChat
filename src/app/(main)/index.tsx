import { router, Stack } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from 'heroui-native/avatar';
import { Button } from 'heroui-native';
import crypto from 'react-native-nitro-crypto';

import { Link } from '@/components/link';

import { useAuthStore } from '@/store/auth';

import { ThrottledTouchable } from '@/components/throttled-touchable';

import { pullChanges } from '@/db/sync';
import { conversationGroupRepository } from '@/db/repositories/conversation-group.repository';
import { chatGroupRepository } from '@/db/repositories/chat-group.repository';

import { useLiveConversationDetails } from '@/features/home/hooks/database/use-live-conversation-details';
import { ConversationList } from '@/features/home/components/conversation-list';

export default function HomeScreen() {
  const safeAreaInsets = useSafeAreaInsets();

  const { user } = useAuthStore((state) => state);

  const { data, isFetching, isLoading, fetchNextPage } = useLiveConversationDetails();

  console.log(data);

  return (
    <>
      <Stack.Screen
        options={{
          header: () => (
            <View style={{ paddingTop: safeAreaInsets.top }} className="flex-row items-center">
              <Link href={'/search'}>Search</Link>
              <Button className="ml-2" onPress={pullChanges}>
                Sync
              </Button>

              <ThrottledTouchable onPress={() => router.push('/settings')} className="ml-auto">
                <Avatar className="size-14" alt={user?.firstName ?? ''}>
                  <Avatar.Image source={user?.avatar ? { uri: user.avatar } : undefined} />
                  <Avatar.Fallback>{user?.firstName[0]}</Avatar.Fallback>
                </Avatar>
              </ThrottledTouchable>

              <Button
                onPress={async () => {
                  const userIds = new Set<string>();

                  for (let i = 0; i < 5; i++) {
                    userIds.add(crypto.randomUUID());
                  }

                  const userIdsArray = Array.from(userIds);

                  const conversationGroup = await conversationGroupRepository.create({
                    name: 'Test Group',
                    adminIds: [userIdsArray[0]],
                    participantIds: userIdsArray,
                  });

                  const chat = await chatGroupRepository.create({
                    conversationId: conversationGroup.id,
                    senderId: userIdsArray[0],
                    text: 'Hello',
                  });

                  console.log('conversationGroup', conversationGroup);

                  console.log('Chat', chat);
                }}>
                Create Group
              </Button>
            </View>
          ),
        }}
      />
      <View className="flex-1 gap-y-2 p-1" style={{ paddingBottom: safeAreaInsets.bottom }}>
        <ConversationList
          data={data}
          onEndReached={fetchNextPage}
          isLoading={isLoading}
          isFetchingNextPage={isFetching}
        />
      </View>
    </>
  );
}
