import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { Text } from '@/components/ui/text';

import { LoginForm } from '@/features/auth/login/components/login-form';

import { Link } from '@/components/ui/link';
import { LoginBanner } from '@/features/auth/login/components/login-banner';
import { useLoginForm } from '@/features/auth/login/hooks/use-login-form';
import { useDeviceConfigStore } from '@/store/device';
import { View } from 'react-native';

export default function LoginScreen() {
  const { mutate, isPending } = useLoginForm();

  const { expoPushToken } = useDeviceConfigStore((state) => state);

  return (
    <KeyboardAwareScrollView contentContainerClassName="flex-1 items-center justify-center p-2">
      <Text variant={'h2'}>Welcome Back !</Text>

      <LoginBanner />

      <LoginForm
        expoPushToken={expoPushToken}
        className="w-full max-w-xl"
        handleSubmit={mutate}
        isSubmitting={isPending}
      />

      <View className="flex-row gap-x-1">
        <Text>Don&apos;t have an account</Text>
        <Link href={'/register'} className="text-blue-500 underline">
          Register Here
        </Link>
      </View>
    </KeyboardAwareScrollView>
  );
}
