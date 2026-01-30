import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Link } from '@/components/ui/link';
import { Text } from '@/components/ui/text';

import { RegisterForm } from '@/features/auth/register/components/register-form';
import { useRegisterForm } from '@/features/auth/register/hooks/use-register-form';

import { useDeviceConfigStore } from '@/store/device';

export default function RegisterFormScreen() {
  const safeAreaInsets = useSafeAreaInsets();

  const { mutate, isPending } = useRegisterForm();

  const { expoPushToken } = useDeviceConfigStore((state) => state);

  return (
    <KeyboardAwareScrollView
      style={{
        paddingTop: safeAreaInsets.top,
      }}
      contentContainerClassName="flex-grow-1 gap-y-2 items-center justify-center p-2">
      <RegisterForm
        expoPushToken={expoPushToken}
        className="w-full max-w-lg"
        handleSubmit={mutate}
        isSubmitting={isPending}
      />

      <View className="flex-row gap-x-1">
        <Text>Already have an account</Text>
        <Link href={'/login'} className="text-blue-500 underline">
          Login
        </Link>
      </View>
    </KeyboardAwareScrollView>
  );
}
