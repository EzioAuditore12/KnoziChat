import { useLocalSearchParams } from 'expo-router';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

import { UserProfile } from '@/features/common/components/user/profile';

import { useGetUser } from '@/features/common/hooks/queries/use-get-user';

import { UserProfileLoading } from '@/features/common/components/user/profile-loading';
import { useRefreshOnFocus } from '@/hooks/use-refresh-on-focus';
import { navgateToChat } from '@/features/chat/direct/components/utils/navigate-to-chat';

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
            email: data.email,
          })
        }>
        <ButtonText>Start Chatting</ButtonText>
      </Button>
    </ScrollView>
  );
}
