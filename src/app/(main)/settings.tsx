import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from 'heroui-native/button';

import { UserProfile } from '@/features/common/components/user-profile';
import { useGetProfile } from '@/features/settings/hooks/queries/use-get-profile';

import { useAuthStore } from '@/store/auth';
import { useRefreshOnFocus } from '@/hooks/use-refresh-on-focus';
import { UserProfileLoading } from '@/features/common/components/user-profile-loading';

export default function SettingsScreen() {
  const safeAreaInsets = useSafeAreaInsets();

  const { logout } = useAuthStore((state) => state);

  const { data, refetch, isLoading } = useGetProfile();

  useRefreshOnFocus(refetch);

  if (isLoading)
    return (
      <ScrollView
        style={{ marginTop: safeAreaInsets.top }}
        contentContainerClassName="flex-grow-1 items-center justify-center gap-y-2 p-2">
        <UserProfileLoading className="w-full max-w-4xl" variant="pulse" isLoading={isLoading} />

        <Button variant="danger" onPress={logout}>
          Logout
        </Button>
      </ScrollView>
    );

  return (
    <ScrollView
      style={{ marginTop: safeAreaInsets.top }}
      contentContainerClassName="flex-grow-1 items-center justify-center gap-y-2 p-2">
      <UserProfile className="w-full" data={data} />

      <Button variant="danger" onPress={logout}>
        Logout
      </Button>
    </ScrollView>
  );
}
