import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Center } from '@/components/ui/center';
import { useGetUser } from '@/features/app/user/hooks/use-get-user';
import { UserProfile } from '@/features/app/user/components/user-profile';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { useInitializeDirectChat } from '@/features/app/chat/hooks/use-initialize-direct-chat';

export default function UserProfileInformation() {
  const safeAreaInsets = useSafeAreaInsets();

  const { id } = useLocalSearchParams() as unknown as { id: string };

  const { data } = useGetUser(id);

  const { mutate, isPending } = useInitializeDirectChat();

  if (!data)
    return (
      <Center>
        <Text>Not Found</Text>
      </Center>
    );

  return (
    <Center
      className="flex-1 gap-y-2 p-2"
      style={{ marginBottom: safeAreaInsets.top }}
    >
      <UserProfile className="w-full max-w-4xl" data={data} />

      <Button
        onPress={() => {
          mutate({ receiverId: data.id, text: 'Hello Phone' });
        }}
        disabled={isPending}
      >
        <ButtonText>{isPending ? 'Intializing' : 'Start Chat'}</ButtonText>
      </Button>
    </Center>
  );
}
