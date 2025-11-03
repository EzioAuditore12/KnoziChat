import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Center } from '@/components/ui/center';
import { useGetUser } from '@/features/app/user/hooks/use-get-user';
import { UserProfile } from '@/features/app/user/components/user-profile';
import { Text } from '@/components/ui/text';

export default function UserProfileInformation() {
  const safeAreaInsets = useSafeAreaInsets();

  const { id } = useLocalSearchParams() as unknown as { id: string };

  const { data } = useGetUser(id);

  if (!data)
    return (
      <Center>
        <Text>Not Found</Text>
      </Center>
    );

  return (
    <Center className="p-2 flex-1" style={{ marginBottom: safeAreaInsets.top }}>
      <UserProfile className='w-full max-w-4xl' data={data} />
    </Center>
  );
}
