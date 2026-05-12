import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

import { UserProfile } from '@/features/common/components/user/profile';

import { useGetUser } from '@/features/common/hooks/queries/use-get-user';

import { conversationDirectRepository } from '@/db/repositories/conversation-direct.repository';
import { UserProfileLoading } from '@/features/common/components/user/profile-loading';
import { useRefreshOnFocus } from '@/hooks/use-refresh-on-focus';

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
  const existingCoversationWithUser = await conversationDirectRepository.getByUserId(userId);

  router.dismissTo('/(main)');

  if (existingCoversationWithUser) {
    router.navigate({
      pathname: '/(main)/chat/direct/[id]',
      params: {
        id: existingCoversationWithUser.id,
        userId: existingCoversationWithUser.userId,
      },
    });
    return;
  }

  router.navigate({
    pathname: '/(main)/chat/new/direct/[id]',
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
        <UserProfileLoading className="w-full max-w-4xl" />
      </ScrollView>
    );

  if (error || !data)
    return (
      <ScrollView contentContainerClassName="flex-grow-1 items-center justify-center gap-y-2 p-2">
        <Text>Something went</Text>
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
        <ButtonText>Start Chatting</ButtonText>
      </Button>
    </ScrollView>
  );
}
