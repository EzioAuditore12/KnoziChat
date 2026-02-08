import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Description } from 'heroui-native/description';

import { Link } from '@/components/link';

import { LoginForm } from '@/features/auth/login/components/login-form';

import { LoginBanner } from '@/features/auth/login/components/login-banner';
import { useLoginForm } from '@/features/auth/login/hooks/use-login-form';
import { useDeviceConfigStore } from '@/store/device';

export default function LoginScreen() {
  const safeAreaInsets = useSafeAreaInsets();

  const { mutate, isPending } = useLoginForm();

  const { expoPushToken } = useDeviceConfigStore((state) => state);

  return (
    <KeyboardAwareScrollView
      style={{
        paddingTop: safeAreaInsets.top,
      }}
      contentContainerClassName="flex-grow-1 items-center justify-center p-2">
      <Description className="text-2xl font-bold">Welcome Back !</Description>

      <LoginBanner />

      <LoginForm
        expoPushToken={expoPushToken}
        className="w-full max-w-xl"
        handleSubmit={mutate}
        isSubmitting={isPending}
      />

      <View className="flex-row gap-x-1">
        <Description>Don&apos;t have an account</Description>
        <Link href={'/register'} className="text-blue-500 underline">
          Register Here
        </Link>
      </View>
    </KeyboardAwareScrollView>
  );
}
