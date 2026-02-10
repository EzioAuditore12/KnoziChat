import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from 'heroui-native/button';
import { Description } from 'heroui-native/description';

import { UserProfile } from '@/features/common/components/user-profile';

import { useGetUser } from '@/features/common/hooks/queries/use-get-user';

import { ConversationRepository } from '@/db/repositories/conversation';
import { useRefreshOnFocus } from '@/hooks/use-refresh-on-focus';
import { UserProfileLoading } from '@/features/common/components/user-profile-loading';

const conversationRepostiory = new ConversationRepository();

const navgateToChat = async ({
  userId,
  avatar,
  firstName,
  lastName,
}: {
  userId: string;
  avatar: string | null;
  firstName: string;
  lastName: string;
}) => {
  const existingCoversationWithUser =
    await conversationRepostiory.getConversationWithUserId(userId);

  router.dismissTo('/(main)');

  if (existingCoversationWithUser) {
    router.navigate({
      pathname: '/(main)/chat/[id]',
      params: {
        id: existingCoversationWithUser.id,
        userId: existingCoversationWithUser._getRaw('user_id') as string,
      },
    });
    return;
  }

  router.navigate({
    pathname: '/(main)/new-chat/[id]',
    params: {
      id: userId,
      name: firstName,
    },
  });
};

export default function UserDetails() {
  const safeAreaInsets = useSafeAreaInsets();

  const { id } = useLocalSearchParams() as unknown as { id: string };

  const { data, refetch, isLoading, error } = useGetUser(id);

  useRefreshOnFocus(refetch);

  if (isLoading)
    return (
      <ScrollView contentContainerClassName="flex-grow-1 items-center justify-center gap-y-2 p-2">
        <UserProfileLoading className="w-full max-w-4xl" variant="pulse" isLoading={isLoading} />
      </ScrollView>
    );

  if (error || !data)
    return (
      <ScrollView contentContainerClassName="flex-grow-1 items-center justify-center gap-y-2 p-2">
        <Description>Something went</Description>
      </ScrollView>
    );

  return (
    <ScrollView
      style={{ marginTop: safeAreaInsets.top }}
      contentContainerClassName="flex-grow-1 items-center justify-center gap-y-2 p-2">
      <UserProfile className="w-full max-w-4xl" data={data} />

      <Button
        onPress={() =>
          navgateToChat({
            userId: id,
            avatar: data.avatar,
            firstName: data.firstName,
            lastName: data.lastName,
          })
        }>
        Start Chatting
      </Button>
    </ScrollView>
  );
}
