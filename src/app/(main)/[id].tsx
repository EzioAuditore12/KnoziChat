import { useLocalSearchParams } from 'expo-router';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UserProfile } from '@/features/common/components/user-profile';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useInitializeDirectChat } from '@/features/chat/hooks/mutations/use-initialize-direct-chat';
import { useGetUser } from '@/features/common/hooks/queries/use-get-user';

export default function UserDetails() {
  const safeAreaInsets = useSafeAreaInsets();

  const { id } = useLocalSearchParams() as unknown as { id: string };

  const { data } = useGetUser(id);

  const { mutate, isPending } = useInitializeDirectChat();

  if (!data)
    return (
      <ScrollView className="flex-1 items-center justify-center">
        <Text variant={'h1'}>Not Found</Text>
      </ScrollView>
    );

  return (
    <ScrollView
      style={{ marginTop: safeAreaInsets.top }}
      contentContainerClassName="flex-1 items-center justify-center gap-y-2 p-2">
      <UserProfile className="w-full max-w-4xl" data={data} />

      <Button
        onPress={() => {
          mutate({ receiverId: data.id, text: 'Hello Phone' });
        }}
        disabled={isPending}>
        <Text>Start Chatting</Text>
      </Button>
    </ScrollView>
  );
}
