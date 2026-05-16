import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';

import { Button, ButtonText } from '@/components/ui/button';
import { Box } from '@/components/ui/box';

import { SettingForm } from '@/features/settings/components/setting-form';

import { useAuthStore } from '@/store/auth';
import { useUpdateProfile } from '@/features/settings/hooks/mutations/use-update-profile';

export default function SettingsScreen() {
  const safeAreaInsets = useSafeAreaInsets();

  const { logout, user } = useAuthStore((state) => state);

  const { mutate, isPending } = useUpdateProfile();

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: 'Settings',
          header: () => (
            <Box
              style={{ paddingTop: safeAreaInsets.top }}
              className="w-full flex-row justify-end px-4">
              <Button variant="destructive" onPress={logout}>
                <ButtonText>Logout</ButtonText>
              </Button>
            </Box>
          ),
        }}
      />
      <KeyboardAwareScrollView
        style={{ paddingBottom: safeAreaInsets.bottom }}
        contentContainerClassName="p-2 grow justify-center items-center"
        extraKeyboardSpace={50}>
        <SettingForm
          className="w-full max-w-4xl"
          defaultValues={user!}
          handleSubmit={mutate}
          isSubmitting={isPending}
        />
      </KeyboardAwareScrollView>
    </>
  );
}
