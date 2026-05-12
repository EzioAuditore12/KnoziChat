import { router } from 'expo-router';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';

import { RegisterForm } from '@/features/auth/register/components/register-form';
import { useRegisterForm } from '@/features/auth/register/hooks/mutations/use-register-form';

import { useDeviceConfigStore } from '@/store/device';

export default function RegisterFormScreen() {
  const safeAreaInsets = useSafeAreaInsets();

  const { mutate, isPending } = useRegisterForm();

  const { expoPushToken } = useDeviceConfigStore((state) => state);

  return (
    <KeyboardAwareScrollView
      style={{
        paddingTop: safeAreaInsets.top,
        paddingBottom: safeAreaInsets.bottom,
      }}
      contentContainerClassName="flex-grow-1 gap-y-2 items-center justify-center p-2">
      <Heading size="2xl" className="self-start font-bold md:self-center">
        Register your Details !
      </Heading>

      <RegisterForm
        expoPushToken={expoPushToken}
        className="w-full max-w-lg"
        handleSubmit={mutate}
        isSubmitting={isPending}
      />

      <View className="flex-row items-center gap-x-1">
        <Text>Already have an account</Text>
        <Button variant="ghost" className="p-0" onPress={() => router.dismissTo('/login')}>
          <ButtonText className="text-[16px] text-blue-500 underline">Login</ButtonText>
        </Button>
      </View>
    </KeyboardAwareScrollView>
  );
}
