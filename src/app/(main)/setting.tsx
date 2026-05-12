import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UserProfile } from '@/features/common/components/user/profile';
import { useGetProfile } from '@/features/settings/hooks/queries/use-get-profile';

import { Button, ButtonText } from '@/components/ui/button';

import { UserProfileLoading } from '@/features/common/components/user/profile-loading';
import { useRefreshOnFocus } from '@/hooks/use-refresh-on-focus';
import { useAuthStore } from '@/store/auth';

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
        <UserProfileLoading className="w-full max-w-4xl" />

        <Button variant="destructive" onPress={logout}>
          <ButtonText>Logout</ButtonText>
        </Button>
      </ScrollView>
    );

  return (
    <ScrollView
      style={{ marginTop: safeAreaInsets.top }}
      contentContainerClassName="flex-grow-1 items-center justify-center gap-y-2 p-2">
      <UserProfile className="w-full" data={data} />

      <Button variant="destructive" onPress={logout}>
        <ButtonText>Logout</ButtonText>
      </Button>
    </ScrollView>
  );
}
