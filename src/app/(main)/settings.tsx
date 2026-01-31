import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

import { UserProfile } from '@/features/common/components/user-profile';
import { useGetProfile } from '@/features/settings/hooks/queries/use-get-profile';

import { useAuthStore } from '@/store/auth';

export default function SettingsScreen() {
  const safeAreaInsets = useSafeAreaInsets();

  const { logout } = useAuthStore((state) => state);

  const { data } = useGetProfile();

  return (
    <ScrollView
      style={{ marginTop: safeAreaInsets.top }}
      contentContainerClassName="flex-grow-1 items-center justify-center gap-y-2 p-2">
      <UserProfile className="w-full" data={data} />

      <Button variant={'destructive'} onPress={logout}>
        <Text>Logout</Text>
      </Button>
    </ScrollView>
  );
}
