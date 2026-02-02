import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UserProfile } from '@/features/common/components/user-profile';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

import { useGetUser } from '@/features/common/hooks/queries/use-get-user';

import { ConversationRepository } from '@/db/repositories/conversation';

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

  const { data } = useGetUser(id);

  if (!data)
    return (
      <ScrollView contentContainerClassName="flex-grow-1 items-center justify-center gap-y-2 p-2">
        <Text variant={'h1'}>Not Found</Text>
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
        <Text>Start Chatting</Text>
      </Button>
    </ScrollView>
  );
}
