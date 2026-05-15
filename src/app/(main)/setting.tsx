import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Stack } from 'expo-router';

import { Button, ButtonText } from '@/components/ui/button';
import { SettingForm } from '@/features/settings/components/setting-form';

import { useAuthStore } from '@/store/auth';
import { useUpdateProfile } from '@/features/settings/hooks/mutations/use-update-profile';

export default function SettingsScreen() {
  const { logout, user } = useAuthStore((state) => state);

  const { mutate, isPending } = useUpdateProfile();

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: 'Settings',
          headerRight: () => (
            <Button variant="destructive" onPress={logout}>
              <ButtonText variant="destructive">Logout</ButtonText>
            </Button>
          ),
        }}
      />
      <KeyboardAwareScrollView
        contentContainerClassName="grow justify-center items-center"
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
